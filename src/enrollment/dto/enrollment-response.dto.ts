export class EnrollmentResponseDto {
  id!: string;
  student_id!: string | null;
  course_id!: string | null;
  last_order!: number | null;
  isCompleted!: boolean;
  created_at!: Date;
}
