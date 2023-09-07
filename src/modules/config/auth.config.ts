import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRATION_TIME,
  refreshTokenTime: process.env.JWT_REFRESH_TOKEN_TIME,
}));
