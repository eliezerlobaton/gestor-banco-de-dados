import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Turmas } from './entities/turmas.entity';
import { TurmasController } from './turmas.controller';
import { TurmasService } from './turmas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turmas]),
    HttpModule
  ],
  controllers: [TurmasController],
  providers: [TurmasService]
})
export class TurmasModule { }
