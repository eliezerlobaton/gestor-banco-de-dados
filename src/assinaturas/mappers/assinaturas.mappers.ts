import { BaseAbstractMapper } from '../../common/mappers/base-abstract.mapper';
import { CreateAssinaturasDto } from '../dto/create-assinaturas.dto';
import { Assinaturas } from '../entities/assinaturas.entity';

export class AssinaturaMapper extends BaseAbstractMapper<
  CreateAssinaturasDto,
  Assinaturas
>{
  mapTo(src: CreateAssinaturasDto): Assinaturas {
    const mapped = new Assinaturas();
    mapped.integration_id = src.id;
    mapped.status = src.status;
    mapped.nome = src.nome;
    mapped.data_criacao = src.dataCriacao ? new Date(src.dataCriacao) : null;
    mapped.data_modificacao = src.dataModificacao
      ? new Date(src.dataModificacao)
      : null;
    mapped.data_inicio = src.dataInicio ? new Date(src.dataInicio) : null;
    mapped.data_cancelamento = src.dataCancelamento
      ? new Date(src.dataCancelamento)
      : null;
    mapped.data_renovacao = src.dataRenovacao
      ? new Date(src.dataRenovacao)
      : null;
    mapped.teste_inicio = src.testeInicio;
    mapped.teste_fim = src.testeFim;
    mapped.ciclo_quantidade = src.cicloQuantidade;
    mapped.ciclo_periodo = src.cicloPeriodo;

    return mapped;
  }
  mapFrom(dest: Assinaturas): CreateAssinaturasDto {
    throw new Error('Method not implemented.');
  }

}