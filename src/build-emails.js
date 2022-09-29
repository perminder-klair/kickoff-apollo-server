import { convertMjmlToEjs, templatesDir } from './utils/mailer';
import { getDirectories } from './utils/helpers';

export default async function handler(req, res) {
  console.log('started...');
  const directories = getDirectories(templatesDir);
  // console.log('directories', directories);

  await Promise.all(
    directories.map(async (directory) => {
      await convertMjmlToEjs(directory);
    }),
  );

  console.log('finished.');
  // res.status(200).json({ success: 'Templates compiled' });
  res.end('Templates compiled');
}
