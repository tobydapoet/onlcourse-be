import { Module } from '@nestjs/common';
import { SalaryConfigService } from './salary-config.service';
import { SalaryConfigController } from './salary-config.controller';

@Module({
  controllers: [SalaryConfigController],
  providers: [SalaryConfigService],
})
export class SalaryConfigModule {}
