export class LessonResponseDto {
  id!: string;
  title!: string;
  course_id!: string | null;
  order!: number;
  video!: string;
  main_teacher_id!: string | null;
  assistant_teacher_id!: string | null;
  created_at!: Date;
}
