import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosMentorias } from 'src/cursos-mentorias/entities/cursos-mentoria.entity';
import { Turmas } from 'src/turmas/entities/turmas.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';

import { AlunosController } from './alunos.controller';
import { AlunosService } from './alunos.service';
import { Alunos } from './entities/aluno.entity';
import { Matricula } from './entities/matricula.entity';
import { AlunoCursoMapper } from './mappers/aluno-curso.mapper';
import { AlunoMatriculaMapper } from './mappers/aluno-matricula.mapper';
import { AlunoMapper } from './mappers/aluno.mapper';
import { AlunoTurmaMapper } from './mappers/aluno.turma.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alunos, Matricula, CursosMentorias, Turmas, Emails]),
    HttpModule
  ],
  controllers: [AlunosController],
  providers: [
    AlunosService,
    AlunoMapper,
    AlunoCursoMapper,
    AlunoTurmaMapper,
    AlunoMatriculaMapper
  ]
})
export class AlunosModule { }
