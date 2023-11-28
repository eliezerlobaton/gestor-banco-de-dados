import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

import { Cupons } from '../entities/cupons.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';


export class PopulateTransacoesDto {
  data_source: DataSourceEnum;
  integration_id: string
  data_criacao: Date;
  data_modificacao: Date;
  status: string;
  data_cancelamento: Date;
  data_confirmacao: Date;
  produto: Produtos;
  oferta: Ofertas;
  valor: number;
  moeda_compra: string;
  quantidade: number;
  metodo_pagamento: string;
  parcelas: number;
  juros: number;
  comissao_produtor: number;
  comissao_plataforma: number;
  comissao_afiliado: number;
  cupom: Cupons;
  usuario: Usuarios;
  assinatura: Assinaturas;
  tracking: Tracking;
}
