import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;

@Controller('single')
export class FilesUploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        // fileSize: 1 * 1024, // 1byte
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: File): Promise<File> {
    return await file;
  }

  @Post('/multiple')
  uploadFiles() {}
}
