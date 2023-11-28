import { Ofertas } from '../entities/ofertas.entity';

export class PopulateProdutosDto {
  integration_id: string;
  nome: string;
  data_criacao: Date;
  data_modificacao: Date;
  tipo: string;
  oferta: Ofertas[];
}