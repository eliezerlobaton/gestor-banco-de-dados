import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class N8nUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsDateString()
  dataCriacao: Date;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  telefone: string;

  @IsNotEmpty()
  @IsString()
  documento: string;

  @IsOptional()
  @IsString()
  cep: string;

  @IsOptional()
  @IsString()
  endereco: string;

  @IsOptional()
  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
