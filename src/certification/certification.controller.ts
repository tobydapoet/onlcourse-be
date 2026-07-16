import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CertificationResponseDto } from './dto/certification-response.dto';
import { CertificationMapper } from './mappers/certification.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

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
        message: 'Create certification success!',
        id: res.id,
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Pagination<CertificationResponseDto>> {
    limit = limit > 50 ? 50 : limit;
    const certifications = await this.certificationService.findAll({
      page,
      limit,
    });
    return mapPagination(certifications, CertificationMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const certification = await this.certificationService.findOne(id);
    return certification ? CertificationMapper.toResponse(certification) : null;
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
        message: 'Update certification success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
