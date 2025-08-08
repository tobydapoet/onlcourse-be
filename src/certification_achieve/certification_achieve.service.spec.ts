import { Test, TestingModule } from '@nestjs/testing';
import { CertificationAchieveService } from './certification_achieve.service';

describe('CertificationAchieveService', () => {
  let service: CertificationAchieveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificationAchieveService],
    }).compile();

    service = module.get<CertificationAchieveService>(CertificationAchieveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
