import { IsOptional, IsString } from 'class-validator';

export class N8nTrackingDto {
  @IsOptional()
  @IsString()
  id: number;

  @IsOptional()
  @IsString()
  externalId: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  checkoutSource: string;

  @IsOptional()
  @IsString()
  utmSource: string;

  @IsOptional()
  @IsString()
  utmCampaign: string;

  @IsOptional()
  @IsString()
  utmMedium: string;

  @IsOptional()
  @IsString()
  utmContent: string;

  @IsOptional()
  @IsString()
  utmTerm: string;
}
