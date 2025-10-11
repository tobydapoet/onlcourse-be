import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateTeacherUserDto } from './dto/create-teacher-user.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.userService.create(createUserDto);
      return {
        id: res.id,
        message: 'Register success!',
      };
    } catch (err) {
      return {
        error: err.message,
      };
    }
  }

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Post('teacher')
  async createTeacher(@Body() createTeacherUserDto: CreateTeacherUserDto) {
    try {
      const res = await this.userService.createTeacher(createTeacherUserDto);
      return {
        id: res.id,
        message: 'Create teacher success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Public()
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      await this.userService.update(id, updateUserDto, file);
      return {
        message: 'Create teacher success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Roles(Role.TEACHER)
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<any>> {
    limit = Math.min(limit, 50);
    return this.userService.findAll({ page, limit });
  }

  @Roles(Role.TEACHER)
  @Get('search')
  searchClient(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 50 ? 50 : limit;
    return this.userService.searchUser(keyword, { page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
