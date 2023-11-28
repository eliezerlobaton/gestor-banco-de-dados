import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { CursosMentorias } from 'src/cursos-mentorias/entities/cursos-mentoria.entity';

import { AlunoCursoDto } from '../dto/aluno-curso.dto';

export class AlunoCursoMapper extends BaseAbstractMapper<AlunoCursoDto, CursosMentorias> {
  mapTo(src: AlunoCursoDto): CursosMentorias {
    const mapped = new CursosMentorias();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.categoria = src.categoria;
    mapped.data_criacao = src.dataCriacao ? new Date(src.dataCriacao) : null;
    mapped.data_modificacao = src.dataModificacao ? new Date(src.dataModificacao) : null;

    return mapped;
  }
  mapFrom(dest: CursosMentorias): AlunoCursoDto {
    throw new Error("Method not implemented.");
  }

}