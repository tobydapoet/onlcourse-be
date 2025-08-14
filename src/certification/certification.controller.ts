import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file_url: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() file_url: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const res = await this.certificationService.create(file_url, file);
      return {
        success: false,
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
    return this.certificationService.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        course_id: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['course_id', 'file'],
    },
  })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() course_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const res = await this.certificationService.update(id, course_id, file);
      return {
        success: false,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
