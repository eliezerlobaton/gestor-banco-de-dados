import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';

import { Tracking } from '../transacoes/entities/tracking.entity';
import { TrackingsController } from './trackings.controller';
import { TrackingsService } from './trackings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tracking, Transacoes]),
    HttpModule
  ],
  controllers: [TrackingsController],
  providers: [TrackingsService]
})
export class TrackingsModule { }
