import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Ofertas } from './ofertas.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Plano extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  integration_id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ nullable: true })
  ciclos: number;

  @Column({ type: 'float', nullable: true })
  desconto_valor: number;

  @Column({ nullable: true })
  desconto_ciclos: number;

  @Column({ type: 'float', nullable: true })
  incremento_valor: number;

  @Column({ nullable: true })
  incremento_ciclo: number;

  @Column({ nullable: true })
  intervalo: number;

  @Column({ nullable: true })
  tipo_intervalo: string;

  @Column({ nullable: true })
  dias_teste: number;

  @Column({ nullable: true })
  teste: boolean;

  @OneToMany(() => Ofertas, (oferta) => oferta.plano)
  oferta: Ofertas[]
}
