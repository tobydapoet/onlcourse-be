import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';
import { CreateTeacherUserDto } from './dto/create-teacher-user.dto';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private studentService: StudentService,
    private teacherService: TeacherService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new Error('This email is already used!');
    }
    const existingPhone = await this.userRepo.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existingPhone) {
      throw new Error('This phone is already used!');
    }
    const newUser = this.userRepo.create(createUserDto);
    const savedUser = await this.userRepo.save(newUser);
    if (savedUser) {
      await this.studentService.create({
        user_id: newUser.id,
      });
    }
    return savedUser;
  }

  async createTeacher(createTeacherDto: CreateTeacherUserDto) {
    const existingEmail = await this.userRepo.findOne({
      where: { email: createTeacherDto.email },
    });
    if (existingEmail) {
      throw new Error('This email is already used!');
    }
    const existingPhone = await this.userRepo.findOne({
      where: { phone: createTeacherDto.phone },
    });
    if (existingPhone) {
      throw new Error('This phone is already used!');
    }
    const newUser = this.userRepo.create({
      name: createTeacherDto.name,
      phone: createTeacherDto.phone,
      password: createTeacherDto.password,
      email: createTeacherDto.email,
      role: Role.TEACHER,
    });
    const savedUser = await this.userRepo.save(newUser);
    if (savedUser) {
      await this.teacherService.create({
        user_id: newUser.id,
        role_type: createTeacherDto.role_type,
        degree: createTeacherDto.degree,
        hr_date: createTeacherDto.hr_date,
      });
    }
    return savedUser;
  }

  findAll() {
    return this.userRepo.find();
  }

  findByIndentifier(indentifier: string) {
    return this.userRepo.findOne({
      where: [{ email: indentifier }, { phone: indentifier }],
    });
  }

  findOne(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }
}
