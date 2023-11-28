import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class UserQueryParametersDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  produto: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transacao: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assinatura: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inicio: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fim: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documento: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pesquisa: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category: number;
}
