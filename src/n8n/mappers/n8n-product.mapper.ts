import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { N8nProductDto } from '../dto/n8n-product.dto';
import { Produtos } from 'src/produtos/entities/produtos.entity';

export class N8nProductMapper extends BaseAbstractMapper<
  N8nProductDto,
  Produtos
> {
  mapTo(src: N8nProductDto): Produtos {
    const mapped = new Produtos();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.data_criacao = src.dataCriacao ? new Date(src.dataCriacao) : null;
    mapped.data_modificacao = src.dataModificacao
      ? new Date(src.dataModificacao)
      : null;
    mapped.tipo = src.tipo;
    return mapped;
  }
  mapFrom(dest: Produtos): N8nProductDto {
    throw new Error('Method not implemented.');
  }
}
