import { Injectable } from '@nestjs/common';
import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { HotmartVoucherDto } from '../dto/hotmart-voucher.dto';
import { Cupons } from 'src/transacoes/entities/cupons.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';

@Injectable()
export class HotmartVoucherMapper extends BaseAbstractMapper<
  HotmartVoucherDto,
  Cupons
> {
  mapTo(src: HotmartVoucherDto): Cupons {
    const mapped = new Cupons();
    mapped.nome = src.code;
    mapped.valor = src.value;
    mapped.data_source = DataSourceEnum.Hotmart;
    return mapped;
  }

  mapFrom(dest: Cupons): HotmartVoucherDto {
    throw new Error('Method not implemented.');
  }
}
