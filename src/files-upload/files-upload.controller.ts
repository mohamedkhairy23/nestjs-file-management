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
import { UploadS3Service } from './services/upload-s3.service';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  constructor(private readonly awsS3: UploadS3Service) {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          new FileTypeValidator({ fileType: /\.?(jpg|jpeg|png|webp)$/i }),
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
  ) {
    return this.awsS3.uploadSingleFile(file);
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
          new FileTypeValidator({ fileType: /\.?(jpg|jpeg|png|webp)$/i }),
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
  ) {
    return this.awsS3.uploadMultipleFiles(files);
  }
}
