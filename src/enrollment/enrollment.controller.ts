import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentMapper } from './mappers/enrollment.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@ApiBearerAuth()
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    try {
      const res = await this.enrollmentService.create(createEnrollmentDto);
      return {
        message: 'Create enrollment success!',
        id: res?.id,
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<EnrollmentResponseDto>> {
    const enrollments = await this.enrollmentService.findAll({ page, limit });
    return mapPagination(enrollments, EnrollmentMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollment = await this.enrollmentService.findOne(id);
    return enrollment ? EnrollmentMapper.toResponse(enrollment) : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @Put(':id')
  async updateOrder(@Param('id') id: string) {
    try {
      await this.enrollmentService.updateOrder(id);
      return {
        message: 'Update enrollment success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.enrollmentService.remove(id);
      return {
        message: 'Delete enrollment success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
