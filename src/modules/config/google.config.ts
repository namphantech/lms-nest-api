import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  secret: process.env.GOOGLE_OAUTH_SECRET,
  callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
}));
