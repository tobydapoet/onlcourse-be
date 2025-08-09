import { registerAs } from '@nestjs/config';

export default registerAs('googleAuth', () => ({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));
