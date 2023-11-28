import { Category } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Ofertas } from './ofertas.entity';

@Entity()
export class Produtos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36, nullable: true })
  integration_id: string;

  @Column({nullable: true})
  nome: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @Column({ nullable: true })
  tipo: string;

  @OneToMany(() => Ofertas, (oferta) => oferta.produto, { cascade: true })
  oferta: Ofertas[];

  @OneToMany(() => Transacoes, (transacao) => transacao.produto)
  transacao: Transacoes[];

  @ManyToMany(() => Category, (category) => category.produtos)
  categories: Category[];
}
