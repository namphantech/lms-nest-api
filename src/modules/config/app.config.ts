import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  statusApp: process.env.APP_ENV,
}));
