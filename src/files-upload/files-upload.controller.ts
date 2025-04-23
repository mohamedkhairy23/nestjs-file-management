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
import { FileSignatureValidator } from 'src/shared/files/validators/file-signature.validator';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1) Validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024, // 2MB
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          // 2) Validate file type (extensions)
          new FileTypeValidator({
            fileType: /\.?(jpg|jpeg|png|webp)$/i,
          }),

          // 3) Custom validation
          new FileSignatureValidator(),
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
  @UseInterceptors(FilesInterceptor('files', 3))
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 1) Validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024, // 2MB
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          // 2) Validate file type (extensions)
          new FileTypeValidator({
            fileType: /\.?(jpg|jpeg|png|webp)$/i,
          }),

          // 3) Custom validation
          new FileSignatureValidator(),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error: string) => {
          console.log('error', error);
          throw new UnprocessableEntityException(error);
        },
        fileIsRequired: true,
      }),
    )
    files: File[],
  ): string[] {
    // this.awsS3.uploadMultipleFiles(files)
    return files.map((file) => file.originalname);
  }
}
