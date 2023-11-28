import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class assinaturaProdutoDto {
  @IsOptional()
  @IsNumber()
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
