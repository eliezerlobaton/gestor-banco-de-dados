import { Plano } from '../entities/plano.entetity';
import { Produtos } from '../entities/produtos.entity';

export class PopulateOfertasDto {

  integration_id: string

  nome: string

  valor: number;

  moeda_compra: string;

  data_criacao: Date;

  data_modificacao: Date;

  produto: Produtos

  plano?: Plano
}