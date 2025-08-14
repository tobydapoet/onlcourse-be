import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';
import { CreateTeacherUserDto } from './dto/create-teacher-user.dto';
import { TeacherService } from 'src/teacher/teacher.service';
import { Role } from 'src/auth/enums/role.enum';
import { CreateGoogleUser } from './dto/create-google.dto';
import { RedisClientType } from 'redis';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(`REDIS_STORAGE`) private readonly cacheStorage: RedisClientType,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private uploadService: UploadService,
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

  async createWithGoogle(createGoogleUserDto: CreateGoogleUser) {
    const existingEmail = await this.userRepo.findOne({
      where: { email: createGoogleUserDto.email },
    });
    if (existingEmail) {
      throw new Error('This email is already used!');
    }

    const newUser = this.userRepo.create(createGoogleUserDto);

    const savedUser = await this.userRepo.save(newUser);
    if (savedUser) {
      await this.studentService.create({
        user_id: newUser.id,
      });
    }
    return savedUser;
  }

  async changePassword(email: string, password: string) {
    return this.userRepo.update({ email }, { password });
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
    file?: Express.Multer.File,
  ) {
    const existingUser = await this.userRepo.findOne({ where: { id } });
    if (!existingUser) {
      throw new UnauthorizedException("Can't find this user!");
    }

    if (file) {
      if (existingUser.avatar_url) {
        await this.uploadService.deleteImage(existingUser.avatar_url);
      }
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'user',
        'image',
      );
      updateUserDto.avatar_url = uploadResult.url;
    }

    const updatedUser = await this.userRepo.update({ id }, updateUserDto);
    if (updatedUser) {
      await this.cacheStorage.del(`user:all`);
      await this.cacheStorage.del(`user:${id}`);
    }
    return await this.userRepo.findOne({ where: { id } });
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
        salary: createTeacherDto.salary,
      });
    }
    return savedUser;
  }

  async findAll() {
    const cachedKey = `user:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allUser = await this.userRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allUser), {
      EX: 60 * 5,
    });
    return allUser;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async updateStudentUser() {}

  async findOne(id: string) {
    const cachedKey = `user:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const user = await this.userRepo.findOne({ where: { id } });
    if (user) {
      await this.cacheStorage.set(cachedKey, JSON.stringify(user), {
        EX: 60 * 5,
      });
    }
    return user;
  }

  async searchUser(keyword: string) {
    return await this.userRepo.find({
      where: [
        { email: Like(`%${keyword}%`) },
        { name: Like(`%${keyword}%`) },
        { phone: Like(`%${keyword}%`) },
      ],
    });
  }
}
