import { IsDateString, IsOptional, IsString } from 'class-validator';

export class N8nProductDto {
  @IsOptional()
  @IsString()
  id: string;

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
  @IsString()
  tipo: string;
}
