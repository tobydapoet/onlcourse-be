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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.userService.create(createUserDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
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
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
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
      const res = await this.userService.update(id, updateUserDto, file);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get('search')
  searchClient(@Query('keyword') keyword: string) {
    return this.userService.searchUser(keyword);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
