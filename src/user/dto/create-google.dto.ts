import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProvideType } from '../types/provider.type';

export class CreateGoogleUser {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  avatar_url: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ProvideType)
  provider_type: ProvideType;

  @IsNotEmpty()
  @IsString()
  provider: string;
}
