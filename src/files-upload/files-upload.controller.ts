import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  @Post('/single')
  @UseInterceptors(
    FileInterceptor('file', {
      // limits: {
      //   // fileSize: 1 * 1024 , // 1byte
      //   fileSize: 2 * 1024 * 1024, // 2MB
      // },
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1) Validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          // 2) Validate file type (extensions)
          new FileTypeValidator({
            fileType: /png|jpg/,
          }),

          // 3) Custom validation
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error: string) => {
          console.log('error', error);
          throw new UnprocessableEntityException(error);
        },
        fileIsRequired: true,
      }),
    )
    file: File,
  ): File {
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
