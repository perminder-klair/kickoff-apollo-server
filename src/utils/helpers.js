import { readdirSync } from 'fs';
import { toLower } from 'lodash';

export const getDirectories = (source) => {
  console.log('getting directories');

  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

export const getFiles = (source) => {
  console.log('getting files');

  return (
    readdirSync(source, { withFileTypes: true })
      // .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  );
};

export const cleanString = (str) => {
  let s = str;
  s = String(str);
  s = s.replace(/\s/g, '');
  s = toLower(s);
  return s;
};
