import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';

import { N8nCreateTransactionDto } from '../dto/n8n-create-transaction.dto';

export class N8nTransactionMapper extends BaseAbstractMapper<
  N8nCreateTransactionDto,
  Transacoes
> {
  mapTo(src: N8nCreateTransactionDto): Transacoes {
    const mapped = new Transacoes();

    mapped.integration_id = src.id;
    mapped.data_criacao = new Date();
    mapped.status = src.status;
    mapped.data_confirmacao = src.dataConfirmacao ? new Date(src.dataConfirmacao) : null;
    mapped.valor = src.valor;
    mapped.moeda_compra = src.moedaCompra;
    mapped.quantidade = src.quantidade;
    mapped.metodo_pagamento = src.metodoPagamento;
    mapped.parcelas = src.parcelas;
    mapped.juros = src.juros;
    mapped.comissao_plataforma = src.comissaoPlataforma;

    return mapped;
  }

  mapFrom(dest: Transacoes): N8nCreateTransactionDto {
    throw new Error('Method not implemented.');
  }
}
