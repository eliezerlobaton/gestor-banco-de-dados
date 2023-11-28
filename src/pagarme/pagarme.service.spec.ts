import { Test, TestingModule } from '@nestjs/testing';
import { PagarmeService } from './pagarme.service';

describe('PagarmeService', () => {
  let service: PagarmeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagarmeService],
    }).compile();

    service = module.get<PagarmeService>(PagarmeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
