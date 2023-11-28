import { Test, TestingModule } from '@nestjs/testing';
import { TurmasService } from './turmas.service';

describe('TurmasService', () => {
  let service: TurmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TurmasService],
    }).compile();

    service = module.get<TurmasService>(TurmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
