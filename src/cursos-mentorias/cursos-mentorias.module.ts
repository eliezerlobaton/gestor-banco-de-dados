import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CursosMentoriasController } from './cursos-mentorias.controller';
import { CursosMentoriasService } from './cursos-mentorias.service';
import { CursosMentorias } from './entities/cursos-mentoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CursosMentorias]),
    HttpModule
  ],
  controllers: [CursosMentoriasController],
  providers: [CursosMentoriasService]
})
export class CursosMentoriasModule { }
