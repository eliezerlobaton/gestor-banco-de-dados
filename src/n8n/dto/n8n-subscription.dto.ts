import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class N8nSubscriptionDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsDateString()
  dataCriacao: string;

  @IsOptional()
  @IsDateString()
  dataModificacao: string;

  @IsOptional()
  @IsDateString()
  dataInicio: string;

  @IsOptional()
  @IsDateString()
  dataCancelamento: string;

  @IsOptional()
  @IsDateString()
  dataRenovacao: string;

  @IsOptional()
  @IsString()
  testeInicio: string;

  @IsOptional()
  @IsString()
  testeFim: string;

  @IsOptional()
  @IsNumber()
  cicloQuantidade: number;

  @IsOptional()
  @IsNumber()
  cicloPeriodo: number;
}
