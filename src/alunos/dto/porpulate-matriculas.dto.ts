import { CursosMentorias } from 'src/cursos-mentorias/entities/cursos-mentoria.entity';
import { Turmas } from 'src/turmas/entities/turmas.entity';

import { Alunos } from '../entities/aluno.entity';

export class PopulateMatriculasDto {
  integration_id: string;
  data_expiracao: Date;
  aluno: Alunos;
  cursoMentoria: CursosMentorias;
  turma: Turmas;
}