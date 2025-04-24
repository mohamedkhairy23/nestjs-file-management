import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadS3Service {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials or region not configured');
    }

    // Instantiate the S3 client with validated credentials
    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadSingleFile(file: Express.Multer.File) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucket) {
      throw new Error('S3 bucket name not configured');
    }

    const uploadParams = {
      Bucket: bucket,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadCommand = new PutObjectCommand(uploadParams);
      const uploadResult = await this.s3.send(uploadCommand);
      return uploadResult;
    } catch (error) {
      throw new Error(`Failed to upload file: ${(error as Error).message}`);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucket) {
      throw new Error('S3 bucket name not configured');
    }

    const results: Array<{
      fileName: string;
      status: 'success' | 'error';
      data?: any;
      error?: string;
    }> = [];

    for (const file of files) {
      const uploadParams = {
        Bucket: bucket,
        Key: `${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const uploadCommand = new PutObjectCommand(uploadParams);
        const uploadResult = await this.s3.send(uploadCommand);

        results.push({
          fileName: file.originalname,
          status: 'success',
          data: uploadResult,
        });
      } catch (error) {
        results.push({
          fileName: file.originalname,
          status: 'error',
          error: (error as Error).message,
        });
      }
    }

    return results;
  }
}
