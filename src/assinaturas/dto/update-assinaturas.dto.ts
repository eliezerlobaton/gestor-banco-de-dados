import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAssinaturasDto {

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dataCriacao?: string;

  @IsOptional()
  @IsDateString()
  dataModificacao?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataRenovacao?: string;

  @IsOptional()
  @IsNumber()
  cicloQuantidade?: number;

  @IsOptional()
  @IsNumber()
  cicloPeriodo?: number;
}
