import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        // fileSize: 1 * 1024 , // 1byte
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: File): File {
    // this.awsS3.uploadSingleFile(file)
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: File[]): File[] {
    // this.awsS3.uploadMultipleFiles(files)
    return files;
  }
}
