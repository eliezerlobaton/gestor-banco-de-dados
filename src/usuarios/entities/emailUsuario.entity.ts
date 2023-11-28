import { Alunos } from 'src/alunos/entities/aluno.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Emails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36, nullable: true })
  integration_id: string;

  @Column()
  email: string;

  @ManyToOne(() => Usuarios, (usuario) => usuario.email)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;

  @OneToOne(() => Alunos, (aluno) => aluno.emailAluno, { cascade: true })
  @JoinColumn({ name: 'aluno_id' })
  aluno: Alunos;
}
