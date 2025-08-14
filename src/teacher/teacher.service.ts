import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  create(createTeacherDto: CreateTeacherDto) {
    const { user_id, ...rest } = createTeacherDto;
    return this.teacherRepo.insert({
      ...rest,
      user: { id: user_id },
    });
  }

  async findAll() {
    const cachedKey = `teacher:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allTeachers = await this.teacherRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allTeachers), {
      EX: 60 * 5,
    });
    return allTeachers;
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
      await this.cacheStorage.del(`teacher:all`);
      await this.cacheStorage.del(`teacher:${id}`);
    }
    return updatedTeacher;
  }
}
