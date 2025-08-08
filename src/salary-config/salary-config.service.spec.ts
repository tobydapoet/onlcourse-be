import { Test, TestingModule } from '@nestjs/testing';
import { SalaryConfigService } from './salary-config.service';

describe('SalaryConfigService', () => {
  let service: SalaryConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryConfigService],
    }).compile();

    service = module.get<SalaryConfigService>(SalaryConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
