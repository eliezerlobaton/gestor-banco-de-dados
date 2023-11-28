import { Matricula } from 'src/alunos/entities/matricula.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Turmas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  nome_curso: string;

  @Column({ nullable: true })
  usuarios_quantidade: number;

  @Column({ type: 'timestamp without time zone' })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone' })
  data_atualizacao: Date;

  @OneToMany(() => Matricula, (matricula) => matricula.turma)
  matricula: Matricula[];
}
