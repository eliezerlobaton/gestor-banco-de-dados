import { Test, TestingModule } from '@nestjs/testing';
import { PagarmeController } from './pagarme.controller';
import { PagarmeService } from './pagarme.service';

describe('PagarmeController', () => {
  let controller: PagarmeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagarmeController],
      providers: [PagarmeService],
    }).compile();

    controller = module.get<PagarmeController>(PagarmeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
