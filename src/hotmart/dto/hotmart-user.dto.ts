import { HotmartUserDocumentTypeEnum } from '../enums/hotmart-user-document-type.enum';

export class HotmartUserDto {
  ucode: string;
  locale: string;
  name: string;
  trade_name: string;
  cellphone: string;
  phone: string;
  email: string;
  documents: {
    value: string;
    type: HotmartUserDocumentTypeEnum;
  }[];
  address: {
    city: string;
    state: string;
    country: string;
    zip_code: string;
    address: string;
    complement: string;
    neighborhood: string;
    number: string;
  };
}
