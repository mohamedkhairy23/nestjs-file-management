import { Module } from '@nestjs/common';
import { FilesUploadController } from './files-upload.controller';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  controllers: [FilesUploadController],
  providers: [CloudinaryService],
})
export class FilesUploadModule {}
