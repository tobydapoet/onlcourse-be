import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

import { Readable } from 'node:stream';

@Injectable()
export class UploadService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUNDIARY_KEY_NAME,
      api_key: process.env.CLOUNDIARY_API_KEY,
      api_secret: process.env.CLOUNDIARY_API_SECRET,
    });
  }

  async uploadImage(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary'));
          resolve(result);
        },
      );

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }

  async deleteImage(input: string) {
    try {
      let publicId = input;
      if (input.startsWith('http')) {
        const urlParts = input.split('/');
        const uploadIndex = urlParts.findIndex((part) => part === 'upload');
        if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
          const pathParts = urlParts.slice(uploadIndex + 1);
          const filename = pathParts.join('/');
          publicId = filename.replace(/\.[^/.]+$/, '');
        }
      }

      return await v2.uploader.destroy(publicId);
    } catch (error: any) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}
