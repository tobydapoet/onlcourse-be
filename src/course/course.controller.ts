import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { CourseResponseDto } from './dto/course-response.dto';
import { CourseMapper } from './mappers/course.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';
import { LessonMapper } from 'src/lesson/mappers/lesson.mapper';
import { QuizMapper } from 'src/quiz/mappers/quiz.mapper';
import { Lesson } from 'src/lesson/entities/lesson.entity';

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
        id: res?.id,
        message: 'Create course success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CourseResponseDto>> {
    limit = limit > 50 ? 50 : limit;
    const courses = await this.courseService.findAll({ page, limit });
    return mapPagination(courses, CourseMapper.toResponse);
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CourseResponseDto | null> {
    const course = await this.courseService.findOne(id);
    return course ? CourseMapper.toResponse(course) : null;
  }

  @ApiBearerAuth()
  @Get('detail/:id')
  async arrange(@Param('id') id: string) {
    const contents = await this.courseService.arrangeAllInCourse(id);
    return contents.map((content) =>
      'video' in content
        ? LessonMapper.toResponse(content as Lesson)
        : QuizMapper.toResponse(content),
    );
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
      await this.courseService.update(id, updateCourseDto, file);
      return {
        message: 'Update course success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  @Put('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.courseService.remove(id);
      return {
        message: 'Delete success!',
      };
    } catch (err: any) {
      return {
        message: err?.message,
      };
    }
  }
}
