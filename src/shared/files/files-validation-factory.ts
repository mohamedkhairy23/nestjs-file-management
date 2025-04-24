import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './validators/file-signature.validator';

const createFileValidators = (
  maxSize: number,
  fileType: RegExp | string,
): FileValidator[] => [
  // 1) Validate file size
  new MaxFileSizeValidator({
    maxSize: maxSize,
    message: (maxSize) => `File is too big. Max file size is ${maxSize} bytes`,
  }),
  // 2) Validate file type (extensions)
  new FileTypeValidator({
    fileType: fileType,
  }),

  // 3) Custom validation
  new FileSignatureValidator(),
];

export const createParseFilePipe = (
  maxSize: number,
  fileType: RegExp | string,
): ParseFilePipe =>
  new ParseFilePipe({
    validators: createFileValidators(maxSize, fileType),
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      console.log('error', error);
      throw new UnprocessableEntityException(error);
    },
    fileIsRequired: true,
  });
