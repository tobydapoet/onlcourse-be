import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class AuthResponseDto {
  id!: string;
  created_at!: Date;
  user!: UserResponseDto;
}
