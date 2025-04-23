/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; // Correct import

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Cloudinary configuration
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials not configured properly');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  // Single file upload
  async uploadSingleFile(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          // no need for cloudinary.v2
          {
            resource_type: 'auto', // Auto-detect file type
            public_id: file.originalname, // Optional: Use original filename
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }

  // Multiple file upload
  async uploadMultipleFiles(files: Express.Multer.File[]) {
    const uploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              // no need for cloudinary.v2
              {
                resource_type: 'auto',
                public_id: file.originalname, // Optional: Use original filename
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(file.buffer);
        }),
    );

    return Promise.all(uploadPromises);
  }
}
