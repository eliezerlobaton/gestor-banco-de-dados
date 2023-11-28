import { DataSourceEnum } from 'src/common/enums/data-source.enum';

export class PopulateAssinaturasDto {
  data_source: DataSourceEnum;
  integration_id: string;
  status: string;
  nome: string;
  data_criacao: Date;
  data_inicio: Date;
  data_cancelamento: Date;
  data_renovacao: Date;
  data_modificacao: Date;
  trial_inicio: string;
  trial_fim: string;
  ciclo_quantidade: number;
  ciclo_periodo: number;
  id: number;
  usuario: number;
  transacao: [];
}
