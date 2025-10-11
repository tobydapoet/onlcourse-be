import { Inject, Injectable } from '@nestjs/common';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SalaryConfig } from './entities/salary-config.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SalaryConfigService {
  constructor(
    @InjectRepository(SalaryConfig)
    private salaryConfigRepo: Repository<SalaryConfig>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private teacherService: TeacherService,
  ) {}

  private async clearSalaryCache() {
    const keys = await this.cacheStorage.keys('salary:*');
    if (keys.length > 0) {
      await this.cacheStorage.del(keys);
    }
  }

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
      await this.clearSalaryCache();
    }
    return savedSalary;
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<SalaryConfig>> {
    const cacheKey = `salary:page:${options.page}:limit:${options.limit}`;
    const cached = await this.cacheStorage.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const queryBuilder = this.salaryConfigRepo.createQueryBuilder('salary');
    queryBuilder.orderBy('salary.created_at', 'DESC');

    const result = await paginate<SalaryConfig>(queryBuilder, options);

    await this.cacheStorage.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 5,
    });

    return result;
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
      await this.clearSalaryCache();
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
      await this.clearSalaryCache();
    }
    return deletedConfig;
  }
}
