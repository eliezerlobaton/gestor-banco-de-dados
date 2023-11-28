import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class N8nVoucherDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  tipo: string;

  @IsOptional()
  @IsNumber()
  valor: number;
}
