import { IsDateString, IsOptional, IsString } from 'class-validator';


export class AlunoCursoDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  categoria: string;

  @IsOptional()
  @IsDateString()
  dataCriacao: string;

  @IsOptional()
  @IsDateString()
  dataModificacao: string;
}