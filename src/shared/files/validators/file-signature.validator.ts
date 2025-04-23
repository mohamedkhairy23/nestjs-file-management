import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import magicBytes from 'magic-bytes.js';

export class FileSignatureValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return `Validation failed (file type doesn't match file signature)`;
  }

  // In case isValid method return false buildErrorMessage will return an error
  isValid(file: any): boolean {
    // Validate file signature
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const fileSignature = magicBytes(file.buffer).map((file) => file.mime);
    console.log('file signature', fileSignature);

    if (!fileSignature.length) return false;

    // check is file signature correct
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const isMatch = fileSignature.includes(file.mimetype);
    if (!isMatch) return false;

    return true;
  }
}
