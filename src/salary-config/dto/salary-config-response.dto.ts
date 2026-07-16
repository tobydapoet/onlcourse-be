export class SalaryConfigResponseDto {
  id!: string;
  teacher_id!: string | null;
  base_salary!: number | null;
  hourly_rate!: number | null;
  hours_worked!: number | null;
  penalty!: number | null;
  bonus_rate!: number | null;
  total!: number | null;
  created_at!: Date;
}
