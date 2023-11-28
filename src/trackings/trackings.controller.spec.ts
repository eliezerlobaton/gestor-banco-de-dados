import { Test, TestingModule } from '@nestjs/testing';
import { TrackingsController } from './trackings.controller';
import { TrackingsService } from './trackings.service';

describe('TrackingsController', () => {
  let controller: TrackingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingsController],
      providers: [TrackingsService],
    }).compile();

    controller = module.get<TrackingsController>(TrackingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
