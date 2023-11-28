import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class N8nPlanDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsNumber()
  ciclos: number;

  @IsOptional()
  @IsNumber()
  descontoValor: number;

  @IsOptional()
  @IsNumber()
  descontoCiclos: number;

  @IsOptional()
  @IsNumber()
  incrementoValor: number;

  @IsOptional()
  @IsNumber()
  incrementoCiclo: number;

  @IsOptional()
  @IsNumber()
  intervalo: number;

  @IsOptional()
  @IsString()
  tipoIntervalo: string;

  @IsOptional()
  @IsNumber()
  diasTeste: number;

  @IsOptional()
  @IsBoolean()
  teste: boolean;
}
