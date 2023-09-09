import * as admin from 'firebase-admin';

export default async function deleteFile(url: string) {
  try {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1].split('?')[0];
    const filePath = `uploads/${fileName}`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    await file.delete();
    console.info('File deleted successfully!');
  } catch (objectError) {
    console.error(objectError.errors[0].message);
  }
}
