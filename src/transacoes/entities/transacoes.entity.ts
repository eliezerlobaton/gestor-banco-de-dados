import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Produtos } from '../../produtos/entities/produtos.entity';
import { Cupons } from './cupons.entity';

@Entity()
export class Transacoes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36, nullable: true })
  integration_id: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_criacao: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_modificacao: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_cancelamento: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_confirmacao: Date;

  @Column({ type: 'float', nullable: true })
  valor: number;

  @Column('varchar', { length: 4, nullable: true })
  moeda_compra: string;

  @Column({ nullable: true })
  quantidade: number;

  @Column('varchar', { length: 30, nullable: true })
  metodo_pagamento: string;

  @Column({ nullable: true })
  parcelas: number;

  @Column({ type: 'float', nullable: true })
  juros: number;

  @Column({ type: 'float', nullable: true })
  comissao_produtor: number;

  @Column({ type: 'float' })
  comissao_plataforma: number;

  @Column({ type: 'float', nullable: true })
  comissao_afiliado: number;

  @ManyToOne(() => Usuarios, (usuario) => usuario.transacao)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;

  @ManyToOne(() => Assinaturas, (assinatura) => assinatura.transacao)
  @JoinColumn({ name: 'assinatura_id' })
  assinatura: Assinaturas;

  @ManyToOne(() => Tracking, (tracking) => tracking.transacao)
  @JoinColumn({ name: 'tracking_id' })
  tracking: Tracking;

  @ManyToOne(() => Cupons, (cupom) => cupom.transacao)
  @JoinColumn({ name: 'cupom_id' })
  cupom: Cupons;

  @ManyToOne(() => Produtos, (produto) => produto.transacao)
  @JoinColumn({ name: 'produto_id' })
  produto: Produtos;

  @ManyToOne(() => Ofertas, (oferta) => oferta.transacao)
  @JoinColumn({ name: 'oferta_id' })
  oferta: Ofertas;

  finishedInstallments: boolean;
  installmentNumber: string;
}
