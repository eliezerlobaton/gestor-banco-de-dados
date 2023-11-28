import { CurrencyCodeEnum } from 'src/common/enums/currency-code.enum';
import { HotmartVoucherDto } from './hotmart-voucher.dto';

export class HotmartTransactionDetailsDto {
  transaction: string;
  product: {
    id: number;
    name: string;
  };
  base: {
    value: number;
    currency_code: CurrencyCodeEnum;
  };
  total: {
    value: number;
    currency_code: CurrencyCodeEnum;
  };
  vat: {
    value: number;
    currency_code: CurrencyCodeEnum;
  };
  fee: {
    value: number;
    currency_code: CurrencyCodeEnum;
  };
  coupon: HotmartVoucherDto;
  real_conversion_rate: number;
}
