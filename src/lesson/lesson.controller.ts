import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { LessonMapper } from './mappers/lesson.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(
    TeacherRole.ADMIN,
    TeacherRole.FULLTIME,
    TeacherRole.PARTTIME,
  )
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const res = await this.lessonService.create(createLessonDto, file);
      return {
        message: 'Create lesson success!',
        id: res.id,
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<LessonResponseDto>> {
    limit = limit > 50 ? 50 : limit;
    const lessons = await this.lessonService.findAll({ page, limit });
    return mapPagination(lessons, LessonMapper.toResponse);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonService.findOne(id);
    return lesson ? LessonMapper.toResponse(lesson) : null;
  }

  @Get('course/:id')
  @ApiParam({ name: 'id', type: String })
  async findByCourse(@Param('id') id: string) {
    const lessons = await this.lessonService.findByCourse(id);
    return lessons.map(LessonMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    try {
      const res = await this.lessonService.update(id, updateLessonDto);
      return {
        message: 'Update lesson success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.lessonService.remove(id);
      return {
        message: 'Delete lesson success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
