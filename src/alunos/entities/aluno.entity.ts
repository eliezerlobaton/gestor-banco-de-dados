import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Matricula } from './matricula.entity';

@Entity()
export class Alunos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Matricula, (matricula) => matricula.aluno, {
    cascade: true,
    eager: true,
  })
  matricula?: Matricula[];

  @OneToOne(() => Emails)
  emailAluno: Emails;
  aluno: Matricula;
}
