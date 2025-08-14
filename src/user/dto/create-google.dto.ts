import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProvideType } from '../types/provider.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoogleUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  avatar_url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProvideType)
  provider_type: ProvideType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  provider: string;
}
