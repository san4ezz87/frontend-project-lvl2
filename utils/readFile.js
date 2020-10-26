import fs from 'fs';
import path from 'path';

function readFile(pathString) {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  const fileUrl = new URL(`file://${compoosedPath}`);
  let value;
  const type = path.extname(pathString);

  try {
    value = fs.readFileSync(fileUrl, 'utf8');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('cant read file', e);
    return {
      type,
      value: '{}',
    };
  }
  return {
    type,
    value,
  };
}

export default readFile;
