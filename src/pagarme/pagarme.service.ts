import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as xlsx from 'node-xlsx';
import * as path from 'path';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagarmeService {
  constructor(
    @InjectRepository(Transacoes)
    private readonly transacoesRepository: Repository<Transacoes>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
    @InjectRepository(Plano)
    private readonly planoRepository: Repository<Plano>,

  ) { }

  parseDateFromExcelTimestamp(timestamp: number): Date {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceExcelEpoch = timestamp - 1; // Excel's epoch starts on December 31, 1899
    const totalMilliseconds = daysSinceExcelEpoch * millisecondsPerDay;
    return new Date(excelEpoch.getTime() + totalMilliseconds);
  }
  async pagarmeImport(filename: string): Promise<{ [key: string]: any }[]> {
    const filePath = path.join(__dirname, '../', '../', filename);
    const workSheetsFromFile = xlsx.parse(filePath);

    const sheetData = workSheetsFromFile[0].data;
    const headers = sheetData[0];
    const data = sheetData.slice(1);

    const formattedData = data.map(row =>
      headers.reduce((rowData, header, index) => {
        rowData[header] = row[index];
        return rowData;
      }, {})
    );

    const listaTransacoes = [];
    for (const transacoes of formattedData) {
      const transacaoDate = this.parseDateFromExcelTimestamp(transacoes.data);
      const usuarios = await this.usuariosRepository.find({
        where:
        {
          documento: transacoes.documento,
        },
      });
      let usuario = usuarios[0];

      if (!usuario) {
        usuario = await this.usuariosRepository.save({
          data_source: transacoes.operadora,
          nome: transacoes.nome,
          telefone: transacoes.telefone,
          documento: transacoes.documento,
          cep: transacoes.cep,
          endereco: transacoes.endereco,
          estado: transacoes.estado,
          cidade: transacoes.cidade,
          numero: transacoes.numero,
          complemento: transacoes.complemento,
          transacao: [],
          assinatura: [],
          email: [
            {
              email: transacoes.email,
            } as Emails,
          ],
          id: 0,
        });
      }

      const produtos = await this.produtosRepository.find({
        where: { nome: transacoes.product },
      });

      let produto = produtos[0];

      if (!produto) {
        produto = await this.produtosRepository.save({
          data_source: transacoes.operadora,
          nome: transacoes.product,
        });
      }

      const planos = await this.planoRepository.find({
        where: { nome: transacoes.plano },
      });

      let plano = planos[0];

      if (!plano) {
        plano = await this.planoRepository.save({
          data_source: transacoes.operadora,
          nome: transacoes?.plano,
        });
      }


      const transacao = {
        data_source: transacoes.operadora,
        integration_id: transacoes.id,
        data_criacao: transacaoDate,
        data_confirmacao: transacaoDate,
        status: transacoes.status,
        produto: <any>produto.id,
        valor: transacoes.valor,
        moeda_compra: 'BRL',
        quantidade: 0,
        metodo_pagamento: transacoes.formaPagamento,
        parcelas: transacoes.parcelas,
        juros: 0,
        comissao_produtor: 0,
        comissao_plataforma: 0,
        comissao_afiliado: 0,
        usuario: <any>usuario.id,
      };

      listaTransacoes.push(transacao);
    }

    if (listaTransacoes.length > 0) {
      const existingTransacoes = await this.transacoesRepository.find();
      const existingTransacoesIds = existingTransacoes.map(
        (transacao) => transacao.integration_id,
      );

      const transacoesToSave = listaTransacoes.filter(
        (transacao: any) => !existingTransacoesIds.includes(transacao.integration_id),
      );

      if (transacoesToSave.length > 0) {
        console.log(transacoesToSave);
        await this.transacoesRepository.save(transacoesToSave, { chunk: transacoesToSave.length / 100 });
      }
    }

    return await this.transacoesRepository.find();
  }

}