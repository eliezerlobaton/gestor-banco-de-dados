import { Column } from 'typeorm';
import { DataSourceEnum } from '../enums/data-source.enum';

export class BaseEntity {
  @Column({ nullable: true })
  data_source: DataSourceEnum;
}
