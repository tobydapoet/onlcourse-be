import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}

  private async clearTeacherCache() {
    const keys = await this.cacheStorage.keys('teacher:page:*');
    if (keys.length > 0) {
      await this.cacheStorage.del(keys);
    }
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const { user_id, ...rest } = createTeacherDto;
    const newTeacher = this.teacherRepo.create({
      ...rest,
      user: { id: user_id },
    });
    return await this.teacherRepo.save(newTeacher);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Teacher>> {
    const cachedKey = `teacher:page:${options.page}:size:${options.limit}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const queryBuilder = this.teacherRepo.createQueryBuilder('teacher');
    const result = await paginate<Teacher>(queryBuilder, options);
    await this.cacheStorage.set(cachedKey, JSON.stringify(result), {
      EX: 60 * 5,
    });
    return result;
  }

  async findOne(id: string) {
    const cachedKey = `teacher:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const teacher = this.teacherRepo.findOne({ where: { id } });
    if (!teacher) {
      throw new UnauthorizedException("Can't find this teacher");
    }
    await this.cacheStorage.set(cachedKey, JSON.stringify(teacher), {
      EX: 60 * 5,
    });
    return teacher;
  }

  async findByUser(user_id: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: user_id } },
    });
    if (!teacher) {
      throw new UnauthorizedException("Can't find this teacher");
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const existing = await this.teacherRepo.findOne({ where: { id } });
    if (!existing) {
      throw new UnauthorizedException("Can't find this teacher");
    }
    const updatedTeacher = await this.teacherRepo.update(
      { id },
      updateTeacherDto,
    );
    if (updatedTeacher) {
      await this.clearTeacherCache();
      await this.cacheStorage.del(`teacher:${id}`);
    }
    return updatedTeacher;
  }
}
