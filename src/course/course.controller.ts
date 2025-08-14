import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const res = await this.courseService.create(createCourseDto, file);
      return {
        success: false,
        data: res,
      };
    } catch (err) {
      return {
        success: true,
        error: err,
      };
    }
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @ApiBearerAuth()
  @Get('detail/:id')
  arrange(@Param('id') id: string) {
    return this.courseService.arrangeAllInCourse(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const res = await this.courseService.update(id, updateCourseDto, file);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message,
      };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  @Put('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.courseService.remove(id);

      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message,
      };
    }
  }
}
