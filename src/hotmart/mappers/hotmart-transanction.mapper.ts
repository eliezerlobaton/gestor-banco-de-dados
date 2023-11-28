import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { HotmartTransactionDto } from '../dto/hotmart-transanction.dto';
import { HotmartTransactionStatusEnum } from '../enums/hotmart-transaction-status.enum';
import { Injectable } from '@nestjs/common';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';

@Injectable()
export class HotmartTransactionMapper
  implements BaseAbstractMapper<HotmartTransactionDto, Transacoes>
{
  mapTo(src: HotmartTransactionDto): Transacoes {
    const mapped = new Transacoes();

    mapped.integration_id = src.purchase.transaction;
    mapped.data_criacao = new Date(src.purchase.order_date);
    mapped.status = src.purchase.status;
    mapped.data_cancelamento =
      src.purchase.status === HotmartTransactionStatusEnum.CANCELLED &&
        src.purchase.approved_date
        ? new Date(src.purchase.approved_date)
        : null;
    mapped.data_confirmacao = src.purchase.approved_date
      ? new Date(src.purchase.approved_date)
      : null;

    mapped.valor = src.purchase.price.value;
    mapped.moeda_compra = src.purchase.price.currency_code;

    mapped.quantidade = src.purchase.recurrency_number;

    mapped.metodo_pagamento = src.purchase.payment.method;
    mapped.parcelas = src.purchase.payment.installments_number;

    mapped.comissao_plataforma = src.purchase.hotmart_fee.total;
    mapped.data_source = DataSourceEnum.Hotmart;

    return mapped;
  }

  mapFrom(dest: Transacoes): HotmartTransactionDto {
    const mapped = new HotmartTransactionDto();
    return mapped;
  }
}
