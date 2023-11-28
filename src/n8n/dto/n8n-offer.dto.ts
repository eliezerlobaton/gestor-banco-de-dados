import {
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class N8nOfferDto {
  @IsOptional()
  @IsNumber()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsNumber()
  valor: number;

  @IsOptional()
  @IsString()
  moedaCompra: string;

  @IsOptional()
  @IsDateString()
  dataCriacao: string;

  @IsOptional()
  @IsDateString()
  dataModificacao: string;
}
