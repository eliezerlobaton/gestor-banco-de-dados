import { Test, TestingModule } from '@nestjs/testing';
import { CursosMentoriasService } from './cursos-mentorias.service';

describe('CursosMentoriasService', () => {
  let service: CursosMentoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursosMentoriasService],
    }).compile();

    service = module.get<CursosMentoriasService>(CursosMentoriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
