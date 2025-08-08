import { Injectable } from '@nestjs/common';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';

@Injectable()
export class SalaryConfigService {
  create(createSalaryConfigDto: CreateSalaryConfigDto) {
    return 'This action adds a new salaryConfig';
  }

  findAll() {
    return `This action returns all salaryConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salaryConfig`;
  }

  update(id: number, updateSalaryConfigDto: UpdateSalaryConfigDto) {
    return `This action updates a #${id} salaryConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} salaryConfig`;
  }
}
