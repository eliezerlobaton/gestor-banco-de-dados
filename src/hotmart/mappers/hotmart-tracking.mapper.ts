import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { HotmartTrackingDto } from '../dto/hotmart-tracking.dto';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';

export class HotmartTrackingMapper extends BaseAbstractMapper<
  HotmartTrackingDto,
  Tracking
> {
  mapTo(src: HotmartTrackingDto): Tracking {
    const mapped = new Tracking();
    mapped.utm_source = src.source || src.source_sck;
    mapped.checkout_source = src.source_sck;
    mapped.external_id = src.external_code;
    mapped.data_source = DataSourceEnum.Hotmart;
    return mapped;
  }

  mapFrom(dest: Tracking): HotmartTrackingDto {
    throw new Error('Method not implemented.');
  }
}
