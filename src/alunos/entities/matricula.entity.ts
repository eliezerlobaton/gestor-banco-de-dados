import { CursosMentorias } from 'src/cursos-mentorias/entities/cursos-mentoria.entity';
import { Turmas } from 'src/turmas/entities/turmas.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Alunos } from './aluno.entity';

@Entity()
export class Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  data_expiracao: Date;

  @ManyToOne(() => Alunos, (aluno) => aluno.matricula)
  @JoinColumn({ name: 'aluno_id' })
  aluno: Alunos;

  @ManyToOne(() => CursosMentorias, (cursoMentoria) => cursoMentoria.matricula)
  @JoinColumn({ name: 'curso_mentoria_id' })
  cursoMentoria: CursosMentorias;

  @ManyToOne(() => Turmas, (turma) => turma.matricula)
  @JoinColumn({ name: 'turma_id' })
  turma: Turmas;
}
