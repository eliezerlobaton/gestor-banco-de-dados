import { Test, TestingModule } from '@nestjs/testing';
import { AssinaturasController } from './assinaturas.controller';
import { AssinaturasService } from './assinaturas.service';

describe('AssinaturasController', () => {
  let controller: AssinaturasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssinaturasController],
      providers: [AssinaturasService],
    }).compile();

    controller = module.get<AssinaturasController>(AssinaturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
