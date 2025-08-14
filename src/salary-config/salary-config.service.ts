import { Inject, Injectable } from '@nestjs/common';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SalaryConfig } from './entities/salary-config.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherRole } from 'src/auth/enums/teacher-role';

@Injectable()
export class SalaryConfigService {
  constructor(
    @InjectRepository(SalaryConfig)
    private salaryConfigRepo: Repository<SalaryConfig>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private teacherService: TeacherService,
  ) {}
  async create(createSalaryConfigDto: CreateSalaryConfigDto) {
    const teacher = await this.teacherService.findOne(
      createSalaryConfigDto.teacher_id,
    );
    let newConfig;
    if (teacher.role_type === TeacherRole.FULLTIME) {
      newConfig = this.salaryConfigRepo.create({
        base_salary: teacher.salary,
        teacher: { id: createSalaryConfigDto.teacher_id },
        penalty: createSalaryConfigDto.penalty,
        bonus_rate: createSalaryConfigDto.bonus_rate,
        total:
          teacher.salary +
          createSalaryConfigDto.bonus_rate * teacher.salary -
          (createSalaryConfigDto.penalty ?? 0),
      });
    } else {
      newConfig = this.salaryConfigRepo.create({
        hourly_rate: teacher.salary,
        hours_worked: createSalaryConfigDto.hours_worked,
        teacher: { id: createSalaryConfigDto.teacher_id },
        penalty: createSalaryConfigDto.penalty,
        bonus_rate: createSalaryConfigDto.bonus_rate,
        total:
          teacher.salary * (createSalaryConfigDto.hours_worked ?? 0) +
          createSalaryConfigDto.bonus_rate * teacher.salary -
          (createSalaryConfigDto.penalty ?? 0),
      });
    }
    const savedSalary = await this.salaryConfigRepo.save(newConfig);
    if (savedSalary) {
      await this.cacheStorage.del(`salary:all`);
    }
    return savedSalary;
  }

  async findAll() {
    const cachedKey = `salary:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allSalaries = await this.salaryConfigRepo.find({
      order: {
        created_at: 'DESC',
      },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(allSalaries), {
      EX: 60 * 5,
    });
    return allSalaries;
  }

  async findOne(id: string) {
    const cachedKey = `salary:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const salryConfig = await this.salaryConfigRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(salryConfig), {
      EX: 60 * 5,
    });
    return salryConfig;
  }

  async update(
    id: string,
    updateSalaryConfigDto: Partial<UpdateSalaryConfigDto>,
  ) {
    const existingConfig = await this.salaryConfigRepo.findOne({
      where: { id },
    });
    if (!existingConfig) {
      throw new Error("Can't find this salary config!");
    }
    const updatedConfig = await this.salaryConfigRepo.update(
      { id },
      updateSalaryConfigDto,
    );
    if (updateSalaryConfigDto) {
      await this.cacheStorage.del(`salary:all`);
      await this.cacheStorage.del(`salary:${id}`);
    }
    return updatedConfig;
  }

  async remove(id: string) {
    const existingConfig = await this.salaryConfigRepo.findOne({
      where: { id },
    });
    if (!existingConfig) {
      throw new Error("Can't find this salary config!");
    }
    const deletedConfig = await this.salaryConfigRepo.delete({ id });
    if (deletedConfig) {
      await this.cacheStorage.del('salary:all');
    }
    return deletedConfig;
  }
}
