import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
  ) {}
  create(createTeacherDto: CreateTeacherDto) {
    return this.teacherRepo.insert({
      ...createTeacherDto,
      user: { id: createTeacherDto.user_id },
    });
  }

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
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

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
