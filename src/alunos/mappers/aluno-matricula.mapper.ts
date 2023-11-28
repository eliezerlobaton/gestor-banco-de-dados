import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';

import { AlunoMatriculaDto } from '../dto/aluno-matricula.dto';
import { Matricula } from '../entities/matricula.entity';

export class AlunoMatriculaMapper extends BaseAbstractMapper<AlunoMatriculaDto, Matricula> {
  mapTo(src: AlunoMatriculaDto): Matricula {
    const mapped = new Matricula();

    mapped.integration_id = src.id;
    mapped.data_expiracao = src.dataExpiracao ? new Date(src.dataExpiracao) : null;

    return mapped;
  }
  mapFrom(dest: Matricula): AlunoMatriculaDto {
    throw new Error("Method not implemented.");
  }

}