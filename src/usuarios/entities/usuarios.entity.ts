import { Alunos } from 'src/alunos/entities/aluno.entity';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Emails } from './emailUsuario.entity';

@Entity()
export class Usuarios extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36, nullable: true })
  integration_id: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ unique: true, nullable: true })
  documento: string;

  @Column({ nullable: true })
  cep: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  complemento: string;

  @OneToMany(() => Transacoes, (transacao) => transacao.usuario, {
    cascade: true,
    eager: true,
  })
  transacao: Transacoes[];

  @OneToMany(() => Assinaturas, (assinaturas) => assinaturas.usuario, {
    cascade: true,
    eager: true,
  })
  assinatura: Assinaturas[];

  @OneToMany(() => Emails, (email) => email.usuario, {
    cascade: true,
    eager: true,
  })
  email: Emails[];

  @Column({ nullable: true, type: 'text' })
  comentarios: string;

  aluno: Alunos;
}
