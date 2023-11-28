import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transacoes } from './transacoes.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Cupons extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integrationId: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  tipo: string;

  @Column({ nullable: true, type: 'float' })
  valor: number;

  @OneToMany(() => Transacoes, (transacao) => transacao.cupom, {
    cascade: true,
    eager: true,
  })
  transacao: Transacoes[];
}
