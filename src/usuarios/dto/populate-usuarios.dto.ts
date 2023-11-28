import { DataSourceEnum } from "src/common/enums/data-source.enum";

export class PopulateUsuariosDto {
  data_source: DataSourceEnum;
  nome: string;
  telefone: string;
  documento: string;
  cep: string;
  estado: string;
  cidade: string;
  endereco: string;
  numero: string;
  complemento: string;
  data_criacao: Date;
  data_modificacao: Date;
  transacao: [];
  assinatura: [];
  email: string;
  integration_id: string;
  comentarios: string;
}