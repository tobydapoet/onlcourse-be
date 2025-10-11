import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @Inject('REDIS_STORAGE') private readonly cacheStorage: RedisClientType,
  ) {}

  private async clearStudentCache() {
    const keys = await this.cacheStorage.keys('student:page:*');
    if (keys.length > 0) {
      await this.cacheStorage.del(keys);
    }
  }

  async create(createStudentDto: CreateStudentDto) {
    const { user_id, ...rest } = createStudentDto;
    const newStudent = this.studentRepo.create({
      ...rest,
      user: { id: user_id },
    });
    const savedStudent = await this.studentRepo.save(newStudent);
    if (savedStudent) {
      await this.clearStudentCache();
    }
    return savedStudent;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Student>> {
    const cacheKey = `student:page:${options.page}:limit:${options.limit}`;
    const cached = await this.cacheStorage.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const queryBuilder = this.studentRepo.createQueryBuilder('student');

    const result = await paginate<Student>(queryBuilder, options);

    await this.cacheStorage.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 5,
    });

    return result;
  }

  async findOne(id: string) {
    const cachedKey = `student:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) {
      throw new UnauthorizedException("Can't find this student");
    }
    await this.cacheStorage.set(cachedKey, JSON.stringify(student), {
      EX: 60 * 5,
    });
    return student;
  }

  async update(id: string, updateStudentDto: Partial<UpdateStudentDto>) {
    const updatedStudent = await this.studentRepo.update(
      { id },
      updateStudentDto,
    );
    if (updatedStudent) {
      await this.clearStudentCache();
      await this.cacheStorage.del(`student:${id}`);
    }
    return updatedStudent;
  }
}
