import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transacoes } from './transacoes.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Tracking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  external_id: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  checkout_source: string;

  @Column({ nullable: false })
  utm_source: string;

  @Column({ nullable: true })
  utm_campaign: string;

  @Column({ nullable: true })
  utm_medium: string;

  @Column({ nullable: true })
  utm_content: string;

  @Column({ nullable: true })
  utm_term: string;

  @OneToMany(() => Transacoes, (transacao) => transacao.tracking, {
    cascade: true,
    eager: true,
  })
  transacao: Transacoes[];
}
