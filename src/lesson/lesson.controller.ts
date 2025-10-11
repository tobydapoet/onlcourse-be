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
import { Lesson } from './entities/lesson.entity';

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
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Lesson>> {
    limit = limit > 50 ? 50 : limit;
    return this.lessonService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Get('course/:id')
  @ApiParam({ name: 'id', type: String })
  findByCourse(@Param('id') id: string) {
    return this.lessonService.findByCourse(id);
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
    } catch (err) {
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
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
