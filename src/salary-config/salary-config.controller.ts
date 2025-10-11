import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SalaryConfigService } from './salary-config.service';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SalaryConfig } from './entities/salary-config.entity';

@ApiBearerAuth()
@Controller('salary-config')
export class SalaryConfigController {
  constructor(private readonly salaryConfigService: SalaryConfigService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Post()
  async create(@Body() createSalaryConfigDto: CreateSalaryConfigDto) {
    try {
      const res = await this.salaryConfigService.create(createSalaryConfigDto);
      return {
        data: res.id,
        message: 'Create salary config success!',
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
  ): Promise<Pagination<SalaryConfig>> {
    limit = limit > 50 ? 50 : limit;
    return this.salaryConfigService.findAll({
      page,
      limit,
    });
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryConfigService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSalaryConfigDto: UpdateSalaryConfigDto,
  ) {
    try {
      const res = await this.salaryConfigService.update(
        id,
        updateSalaryConfigDto,
      );
      return {
        message: 'Update salary config success!',
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
      await this.salaryConfigService.remove(id);
      return {
        message: 'Delete salary config success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
