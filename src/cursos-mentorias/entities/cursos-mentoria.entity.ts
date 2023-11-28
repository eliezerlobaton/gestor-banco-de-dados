import { Matricula } from 'src/alunos/entities/matricula.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CursosMentorias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @OneToMany(() => Matricula, (matricula) => matricula.cursoMentoria)
  matricula: Matricula[];
}
