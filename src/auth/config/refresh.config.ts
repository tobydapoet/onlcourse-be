import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh_token',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_SECRET,
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  }),
);
