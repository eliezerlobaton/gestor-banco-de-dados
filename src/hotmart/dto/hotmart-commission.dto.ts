import { CurrencyCodeEnum } from 'src/common/enums/currency-code.enum';
import { HotmartComissionTypeEnum } from '../enums/hotmart-comission-type.enum';

export class HotmartCommissionDto {
  commission: {
    currency_value: CurrencyCodeEnum;
    value: number;
  };
  user: {
    ucode: string;
    name: string;
  };
  source: HotmartComissionTypeEnum;
}
