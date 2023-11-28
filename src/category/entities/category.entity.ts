import { Produtos } from 'src/produtos/entities/produtos.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Produtos, (produto) => produto.categories)
  @JoinTable()
  produtos: Produtos[];
}
