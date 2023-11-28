import { Type } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { AssinaturaUserDto } from './assinatura-user.dto';

export class CreateAssinaturasDto {
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

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AssinaturaUserDto)
  usuario: AssinaturaUserDto;
}
