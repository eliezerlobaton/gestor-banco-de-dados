import { BaseEntity } from 'src/common/entities/base.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Plano } from './plano.entetity';
import { Produtos } from './produtos.entity';

@Entity()
export class Ofertas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ type: 'float', nullable: true })
  valor: number;

  @Column({ nullable: true })
  moeda_compra: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @ManyToOne(() => Produtos, (produto) => produto.oferta)
  @JoinColumn({ name: 'produto_id' })
  produto: Produtos;

  @ManyToOne(() => Plano, (plano) => plano.oferta, { cascade: true, eager: true })
  @JoinColumn({ name: 'plano_id' })
  plano?: Plano

  @OneToMany(() => Transacoes, (transacao) => transacao.oferta)
  transacao: Transacoes[];
}
