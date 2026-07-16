import { UserMapper } from 'src/user/mappers/user.mapper';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Auth } from '../entities/auth.entity';

export class AuthMapper {
  static toResponse(auth: Auth): AuthResponseDto {
    return {
      id: auth.id,
      created_at: auth.created_at,
      user: UserMapper.toResponse(auth.user),
    };
  }
}
