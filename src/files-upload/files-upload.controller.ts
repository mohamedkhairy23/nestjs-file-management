import {
  BadRequestException,
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
import { MaxFileCount } from 'src/shared/files/constants/file-count.constants';

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
    @UploadedFile(createParseFilePipe('2MB', ['jpeg', 'jpg', 'png', 'webp']))
    file: File,
  ): Promise<any> {
    // return file;
    // return this.awsS3.uploadSingleFile(file);
    return this.cloudinaryService.uploadSingleFile(file);
  }

  @Post('/multiple')
  // @UseInterceptors(FilesInterceptor('files',MaxFileCount.MY_IMAGES))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles(createParseFilePipe('2MB', ['jpeg', 'jpg', 'png', 'webp']))
    files: File[],
  ) {
    if (files.length > MaxFileCount.MY_IMAGES) {
      throw new BadRequestException(
        `Sorry, You can't upload more than ${MaxFileCount.MY_IMAGES} files.`,
      );
    }
    // return files.map((file) => file.originalname);
    // return this.awsS3.uploadMultipleFiles(files);
    return this.cloudinaryService.uploadMultipleFiles(files);
  }
}
