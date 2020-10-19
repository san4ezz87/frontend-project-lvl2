import fs from 'fs';
import path from 'path';

function readFile(pathString) {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  const fileUrl = new URL(`file://${compoosedPath}`);
  let data;
  const ext = path.extname(pathString);

  try {
    data = fs.readFileSync(fileUrl, 'utf8');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('cant read file', e);
    return {
      ext,
      data: '{}',
    };
  }
  return {
    ext,
    data,
  };
}

export default readFile;
