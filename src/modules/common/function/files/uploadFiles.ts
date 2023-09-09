import * as admin from 'firebase-admin';

export default async function uploadFiles(files: Express.Multer.File[]) {
  try {
    const urls = [];
    for (const file of files) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const spl = file.originalname.split('.');
      const newFileName = spl[0] + '-' + uniqueSuffix;

      const bucket = admin.storage().bucket();
      const destination = `uploads/${newFileName}`;
      const fileUpload = bucket.file(destination);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (error) => {
        console.error(error.message);
      });

      stream.end(file.buffer);

      await new Promise((resolve) => stream.on('finish', resolve));

      console.info('File uploaded successfully!');
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2025',
      });
      urls.push(url);
    }
    return urls;
  } catch (error) {
    console.error(error);
  }
}
