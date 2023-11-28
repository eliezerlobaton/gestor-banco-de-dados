import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { N8nOfferDto } from '../dto/n8n-offer.dto';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';

export class N8nOfferMapper extends BaseAbstractMapper<N8nOfferDto, Ofertas> {
  mapTo(src: N8nOfferDto): Ofertas {
    const mapped = new Ofertas();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.valor = src.valor;
    mapped.moeda_compra = src.moedaCompra;
    mapped.data_criacao = src.dataCriacao ? new Date(src.dataCriacao) : null;
    mapped.data_modificacao = src.dataModificacao
      ? new Date(src.dataModificacao)
      : null;

    return mapped;
  }

  mapFrom(dest: Ofertas): N8nOfferDto {
    throw new Error('Method not implemented.');
  }
}
