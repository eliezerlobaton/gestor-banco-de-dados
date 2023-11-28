import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Turmas } from 'src/turmas/entities/turmas.entity';

import { AlunoTurmasDto } from '../dto/aluno-turma.dto';

export class AlunoTurmaMapper extends BaseAbstractMapper<AlunoTurmasDto, Turmas> {
  mapTo(src: AlunoTurmasDto): Turmas {
    const mapped = new Turmas();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.data_criacao = src.dataCriacao ? new Date(src.dataCriacao) : null;
    mapped.data_atualizacao = src.dataAtualizacao ? new Date(src.dataAtualizacao) : null;

    return mapped;
  }
  mapFrom(dest: Turmas): AlunoTurmasDto {
    throw new Error("Method not implemented.");
  }
}