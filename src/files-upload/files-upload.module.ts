import { Module } from '@nestjs/common';
import { FilesUploadController } from './files-upload.controller';
import { UploadS3Service } from './services/upload-s3.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  controllers: [FilesUploadController],
  providers: [UploadS3Service, CloudinaryService],
})
export class FilesUploadModule {}
