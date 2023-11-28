import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlunoDto {
  @IsNumber()
  id: number

  @IsOptional()
  @IsDateString()
  dataExpiracao: Date;
}
