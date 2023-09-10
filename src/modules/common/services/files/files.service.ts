import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FilesService {
  private bucket = admin.storage().bucket();

  private async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const spl = file.originalname.split('.');
    const newFileName = spl[0] + '-' + uniqueSuffix;

    const destination = `uploads/${newFileName}`;
    const fileUpload = this.bucket.file(destination);
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
    return url;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      return await this.uploadSingleFile(file);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1].split('?')[0];
      const filePath = `uploads/${fileName}`;
      const file = this.bucket.file(filePath);
      await file.delete();
      console.info('File deleted successfully!');
    } catch (objectError) {
      console.error(objectError.errors[0].message);
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const urls = [];
      for (const file of files) {
        const url = await this.uploadSingleFile(file);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFiles(urls: string[]): Promise<void> {
    try {
      for (const url of urls) {
        await this.deleteFile(url);
      }
      console.info('Files deleted successfully!');
    } catch (objectError) {
      console.error(objectError.errors[0].message);
    }
  }
}
