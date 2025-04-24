import * as bytes from 'bytes';
import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './validators/file-signature.validator';
import { FileSizeType, FileType } from './types/file.types';
import { createFileTypeRegex } from './utils/file.util';
import { NotEmptyArray } from '../utils/array.util';

const createFileValidators = (
  maxSize: FileSizeType,
  fileType: NotEmptyArray<FileType>,
): FileValidator[] => {
  const maxBytes = bytes(maxSize);
  if (maxBytes === null) {
    throw new Error(`Invalid maxSize value: ${maxSize}`);
  }

  const fileTypeRegex = createFileTypeRegex(fileType);

  return [
    // 1) Validate file size
    new MaxFileSizeValidator({
      maxSize: maxBytes,
      message: (maxSize) =>
        `File is too big. Max file size is ${maxSize} bytes`,
    }),
    // 2) Validate file type (extensions)
    new FileTypeValidator({
      fileType: fileTypeRegex,
    }),
    // 3) Custom validation
    new FileSignatureValidator(),
  ];
};

export const createParseFilePipe = (
  maxSize: FileSizeType,
  fileType: NotEmptyArray<FileType>,
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
