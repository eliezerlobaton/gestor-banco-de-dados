import { Test, TestingModule } from '@nestjs/testing';
import { CursosMentoriasController } from './cursos-mentorias.controller';
import { CursosMentoriasService } from './cursos-mentorias.service';

describe('CursosMentoriasController', () => {
  let controller: CursosMentoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosMentoriasController],
      providers: [CursosMentoriasService],
    }).compile();

    controller = module.get<CursosMentoriasController>(CursosMentoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
