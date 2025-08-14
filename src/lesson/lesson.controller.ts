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
    return this.lessonService.findAll();
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

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.lessonService.remove(id);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
