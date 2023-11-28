import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Produtos } from 'src/produtos/entities/produtos.entity';

import { assinaturaProdutoDto } from '../dto/assinatura-produto.dto';

export class AssinaturaProdutoMapper extends BaseAbstractMapper<
  assinaturaProdutoDto,
  Produtos
> {
  mapTo(src: assinaturaProdutoDto): Produtos {
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
  mapFrom(dest: Produtos): assinaturaProdutoDto {
    throw new Error('Method not implemented.');
  }
}