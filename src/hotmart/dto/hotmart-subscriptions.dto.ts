import { CurrencyCodeEnum } from 'src/common/enums/currency-code.enum';
import { HotmartSubscriptionStatusEnum } from '../enums/hotmart-subscription-status.enum';

export class HotmartSubscriptionDto {
  subscriber_code: string;
  subscription_id: number;
  status: HotmartSubscriptionStatusEnum;
  accession_date: number;
  end_accession_date: number;
  request_date: number;
  date_next_charge: number;
  trial: boolean;
  transaction: string;
  plan: {
    name: string;
    id: number;
    recurrency_period: number;
    max_charge_cycles: number;
  };
  product: {
    id: number;
    name: string;
    ucode: string;
  };
  price: {
    value: number;
    currency_code: CurrencyCodeEnum;
  };
  subscriber: {
    name: string;
    email: string;
    ucode: string;
  };
}
