import { Type } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { N8nOfferDto } from './n8n-offer.dto';
import { N8nPlanDto } from './n8n-plan.dto';
import { N8nProductDto } from './n8n-product.dto';
import { N8nSubscriptionDto } from './n8n-subscription.dto';
import { N8nTrackingDto } from './n8n-tracking.dto';
import { N8nUserDto } from './n8n-user.dto';
import { N8nVoucherDto } from './n8n-voucher.dto';

export class N8nCreateTransactionDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  dataConfirmacao: string;

  @IsOptional()
  @IsNumber()
  valor: number;

  @IsOptional()
  @IsString()
  moedaCompra: string;

  @IsOptional()
  @IsNumber()
  quantidade: number;

  @IsOptional()
  @IsString()
  metodoPagamento: string;

  @IsOptional()
  @IsNumber()
  parcelas: number;

  @IsOptional()
  @IsNumber()
  juros: number;

  @IsOptional()
  @IsNumber()
  comissaoPlataforma: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => N8nUserDto)
  usuario: N8nUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => N8nSubscriptionDto)
  assinatura: N8nSubscriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => N8nVoucherDto)
  cupom: N8nVoucherDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => N8nProductDto)
  produto: N8nProductDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => N8nOfferDto)
  oferta: N8nOfferDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => N8nPlanDto)
  plano: N8nPlanDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => N8nPlanDto)
  tracking: N8nTrackingDto;
}
