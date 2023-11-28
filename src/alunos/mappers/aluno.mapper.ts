import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';

import { CreateAlunoDto } from '../dto/create-aluno.dto';
import { Alunos } from '../entities/aluno.entity';

export class AlunoMapper extends BaseAbstractMapper<CreateAlunoDto, Alunos> {
  mapTo(src: CreateAlunoDto): Alunos {
    const mapped = new Alunos();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.email = src.email;

    return mapped;
  }
  mapFrom(dest: Alunos): CreateAlunoDto {
    throw new Error("Method not implemented.");
  }

}