import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

describe('TransacoesController', () => {
  let controller: TransacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [TransacoesService],
    }).compile();

    controller = module.get<TransacoesController>(TransacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
