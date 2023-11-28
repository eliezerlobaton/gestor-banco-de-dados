import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { HotmartSubscriptionDto } from '../dto/hotmart-subscriptions.dto';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';

export class HotmartSubscriptionMapper extends BaseAbstractMapper<
  HotmartSubscriptionDto,
  Assinaturas
> {
  mapTo(src: HotmartSubscriptionDto): Assinaturas {
    const mapped = new Assinaturas();
    mapped.integration_id = src.subscription_id.toString();
    mapped.status = src.status;
    mapped.nome = src.plan.name;
    mapped.data_criacao = new Date(src.request_date);
    mapped.data_inicio = new Date(src.accession_date);
    mapped.data_cancelamento = src.end_accession_date
      ? new Date(src.end_accession_date)
      : null;
    mapped.data_renovacao = src.date_next_charge
      ? new Date(src.date_next_charge)
      : null;
    mapped.ciclo_quantidade = src.plan.max_charge_cycles;
    mapped.ciclo_periodo = src.plan.recurrency_period;
    mapped.data_source = DataSourceEnum.Hotmart;
    mapped.teste = src.trial;
    console.log(mapped);
    return mapped;
  }

  mapFrom(dest: Assinaturas): HotmartSubscriptionDto {
    throw new Error('Method not implemented.');
  }
}
