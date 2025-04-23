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
import { CloudinaryService } from './services/cloudinary.service';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {} // Inject CloudinaryService

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
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
  ): Promise<any> {
    // Use CloudinaryService to upload single file
    return this.cloudinaryService.uploadSingleFile(file);
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadFiles(
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
  ): Promise<any> {
    // Use CloudinaryService to upload multiple files
    return this.cloudinaryService.uploadMultipleFiles(files);
  }
}
