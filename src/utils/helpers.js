import { readdirSync } from 'fs';

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
