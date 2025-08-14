import { Module } from '@nestjs/common';
import { SalaryConfigService } from './salary-config.service';
import { SalaryConfigController } from './salary-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryConfig } from './entities/salary-config.entity';
import { CacheModule } from 'src/cache/cache.module';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalaryConfig]),
    CacheModule,
    TeacherModule,
  ],
  controllers: [SalaryConfigController],
  providers: [SalaryConfigService],
})
export class SalaryConfigModule {}
