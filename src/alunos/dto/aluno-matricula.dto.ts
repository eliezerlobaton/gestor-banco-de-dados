import { Type } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { AlunoCursoDto } from './aluno-curso.dto';
import { AlunoTurmasDto } from './aluno-turma.dto';
import { CreateAlunoDto } from './create-aluno.dto';


export class AlunoMatriculaDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsDateString()
  dataExpiracao: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AlunoCursoDto)
  curso: AlunoCursoDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AlunoTurmasDto)
  turma: AlunoTurmasDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAlunoDto)
  aluno: CreateAlunoDto;
}