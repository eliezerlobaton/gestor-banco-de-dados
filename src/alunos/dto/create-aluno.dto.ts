import { IsOptional, IsString } from 'class-validator';


export class CreateAlunoDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  email: string;
}
