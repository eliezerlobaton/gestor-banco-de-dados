import { BaseEntity } from 'src/common/entities/base.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transacoes } from '../../transacoes/entities/transacoes.entity';

@Entity()
export class Assinaturas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36, nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_inicio: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_cancelamento: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_renovacao: Date;

  @Column({ nullable: true })
  teste_inicio: string;

  @Column({ nullable: true })
  teste_fim: string;

  @Column({ nullable: true })
  teste: boolean;

  @Column({ nullable: true })
  ciclo_quantidade: number;

  @Column({ nullable: true })
  ciclo_periodo: number;

  @ManyToOne(() => Usuarios, (usuario) => usuario.assinatura)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;

  @OneToMany(() => Transacoes, (transacoes) => transacoes.assinatura, {
    cascade: true,
  })
  transacao: Transacoes[];
}
