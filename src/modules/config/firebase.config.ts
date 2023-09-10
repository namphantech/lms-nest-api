import * as admin from 'firebase-admin';
import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined,
  }),
  storageBucket: process.env.BUCKET_NAME,
}));
