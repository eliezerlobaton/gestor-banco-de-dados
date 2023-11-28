import { CurrencyCodeEnum } from 'src/common/enums/currency-code.enum';
import { HotmartTransactionStatusEnum } from '../enums/hotmart-transaction-status.enum';
import { HotmartPaymentTypeEnum } from '../enums/hotmart-payment-type.enum';
import { HotmartComissionTypeEnum } from '../enums/hotmart-comission-type.enum';
import { HotmartTrackingDto } from './hotmart-tracking.dto';

export class HotmartTransactionDto {
  buyer: {
    ucode: string;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
  };
  purchase: {
    is_subscription: boolean;
    status: HotmartTransactionStatusEnum;
    warranty_expire_date: number;
    hotmart_fee: {
      base: number;
      fixed: number;
      currency_code: CurrencyCodeEnum;
      total: number;
    };
    recurrency_number: number;
    price: {
      currency_code: CurrencyCodeEnum;
      value: number;
    };
    transaction: string;
    offer: {
      code: string;
      payment_mode: string;
    };
    approved_date: number;
    order_date: number;
    commission_as: HotmartComissionTypeEnum;
    payment: {
      method: string;
      type: HotmartPaymentTypeEnum;
      installments_number: number;
    };
    tracking: HotmartTrackingDto;
  };
  producer: {
    ucode: string;
    name: string;
  };
}
