import { Test, TestingModule } from '@nestjs/testing';
import { CertificationAchieveController } from './certification_achieve.controller';
import { CertificationAchieveService } from './certification_achieve.service';

describe('CertificationAchieveController', () => {
  let controller: CertificationAchieveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificationAchieveController],
      providers: [CertificationAchieveService],
    }).compile();

    controller = module.get<CertificationAchieveController>(CertificationAchieveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
