import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { N8nVoucherDto } from '../dto/n8n-voucher.dto';
import { Cupons } from 'src/transacoes/entities/cupons.entity';

export class N8nVoucherMapper extends BaseAbstractMapper<
  N8nVoucherDto,
  Cupons
> {
  mapTo(src: N8nVoucherDto): Cupons {
    const mapped = new Cupons();

    mapped.integrationId = src.id;
    mapped.nome = src.nome;
    mapped.tipo = src.tipo;
    mapped.valor = src.valor;

    return mapped;
  }

  mapFrom(dest: Cupons): N8nVoucherDto {
    throw new Error('Method not implemented.');
  }
}
