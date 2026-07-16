import { SalaryConfigResponseDto } from '../dto/salary-config-response.dto';
import { SalaryConfig } from '../entities/salary-config.entity';

export class SalaryConfigMapper {
  static toResponse(entity: SalaryConfig): SalaryConfigResponseDto {
    return {
      id: entity.id,
      teacher_id: entity.teacher?.id ?? null,
      base_salary:
        entity.base_salary == null ? null : Number(entity.base_salary),
      hourly_rate:
        entity.hourly_rate == null ? null : Number(entity.hourly_rate),
      hours_worked:
        entity.hours_worked == null ? null : Number(entity.hours_worked),
      penalty: entity.penalty == null ? null : Number(entity.penalty),
      bonus_rate: entity.bonus_rate == null ? null : Number(entity.bonus_rate),
      total: entity.total == null ? null : Number(entity.total),
      created_at: entity.created_at,
    };
  }
}
