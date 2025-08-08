import { Test, TestingModule } from '@nestjs/testing';
import { SalaryConfigController } from './salary-config.controller';
import { SalaryConfigService } from './salary-config.service';

describe('SalaryConfigController', () => {
  let controller: SalaryConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryConfigController],
      providers: [SalaryConfigService],
    }).compile();

    controller = module.get<SalaryConfigController>(SalaryConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
