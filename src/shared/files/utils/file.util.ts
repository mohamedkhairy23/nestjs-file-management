import { FileType } from '../types/file.types';
import { lookup } from 'mime-types';

// ["png", "jpg"]]
export const createFileTypeRegex = (fileTypes: FileType[]): RegExp => {
  // check if file type with a correct media type (In case of sending wrong mimetype will ignore it)
  const mediaTypes = fileTypes
    .map((type) => lookup(type))
    .filter((type) => type !== false);

  return new RegExp(mediaTypes.join('|'));
};
