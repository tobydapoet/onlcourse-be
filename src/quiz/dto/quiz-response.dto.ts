export class QuizResponseDto {
  id!: string;
  title!: string;
  course_id!: string | null;
  order!: number;
  duration!: string | null;
}
