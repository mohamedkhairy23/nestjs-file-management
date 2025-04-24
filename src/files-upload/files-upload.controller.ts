import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/shared/files/files-validation-factory';
import { UploadS3Service } from './services/upload-s3.service';
import { CloudinaryService } from './services/cloudinary.service';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  constructor(
    private readonly awsS3: UploadS3Service,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      createParseFilePipe(2 * 1024 * 1024, /\.?(jpg|jpeg|png|webp)$/i),
    )
    file: File,
  ): Promise<any> {
    // return file;
    // return this.awsS3.uploadSingleFile(file);
    return this.cloudinaryService.uploadSingleFile(file);
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadFiles(
    @UploadedFiles(
      createParseFilePipe(2 * 1024 * 1024, /\.?(jpg|jpeg|png|webp)$/i),
    )
    files: File[],
  ) {
    // return files.map((file) => file.originalname);
    // return this.awsS3.uploadMultipleFiles(files);
    return this.cloudinaryService.uploadMultipleFiles(files);
  }
}
