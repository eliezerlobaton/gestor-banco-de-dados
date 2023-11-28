import { Test, TestingModule } from '@nestjs/testing';
import { AssinaturasService } from './assinaturas.service';

describe('AssinaturasService', () => {
  let service: AssinaturasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssinaturasService],
    }).compile();

    service = module.get<AssinaturasService>(AssinaturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
