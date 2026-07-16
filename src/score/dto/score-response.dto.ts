export class ScoreResponseDto {
  id!: string;
  student_id!: string | null;
  quiz_id!: string | null;
  total!: number;
  correct!: number;
}
