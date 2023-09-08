import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  statusApp: process.env.APP_ENV,
  workingDirectory: process.cwd(),
  frontendDomain: process.env.FRONTEND_DOMAIN,
}));
