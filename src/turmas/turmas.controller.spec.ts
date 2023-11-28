import { Test, TestingModule } from '@nestjs/testing';
import { TurmasController } from './turmas.controller';
import { TurmasService } from './turmas.service';

describe('TurmasController', () => {
  let controller: TurmasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurmasController],
      providers: [TurmasService],
    }).compile();

    controller = module.get<TurmasController>(TurmasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
