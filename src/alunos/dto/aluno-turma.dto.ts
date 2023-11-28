import { IsDateString, IsOptional, IsString } from 'class-validator';


export class AlunoTurmasDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsDateString()
  dataCriacao: string

  @IsOptional()
  @IsDateString()
  dataAtualizacao: string
}


