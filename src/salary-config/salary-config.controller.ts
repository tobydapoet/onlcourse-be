import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalaryConfigService } from './salary-config.service';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';

@Controller('salary-config')
export class SalaryConfigController {
  constructor(private readonly salaryConfigService: SalaryConfigService) {}

  @Post()
  create(@Body() createSalaryConfigDto: CreateSalaryConfigDto) {
    return this.salaryConfigService.create(createSalaryConfigDto);
  }

  @Get()
  findAll() {
    return this.salaryConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryConfigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryConfigDto: UpdateSalaryConfigDto) {
    return this.salaryConfigService.update(+id, updateSalaryConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryConfigService.remove(+id);
  }
}
