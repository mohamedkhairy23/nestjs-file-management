import { Module } from '@nestjs/common';
import { FilesUploadController } from './files-upload.controller';
import { UploadS3Service } from './services/upload-s3.service';

@Module({
  controllers: [FilesUploadController],
  providers: [UploadS3Service],
})
export class FilesUploadModule {}
