import { FileType } from '../types/file.types';

// ["png", "jpg"]]
export const createFileTypeRegex = (fileTypes: FileType[]): RegExp =>
  new RegExp(fileTypes.join('|'));
