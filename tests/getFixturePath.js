import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => {
  const ext = path.extname(filename);

  let data;
  try {
    data = fs.readFileSync(getFixturePath(filename), 'utf8');
  } catch (e) {
    process.stdout.write('cant read file', e);
  }

  return {
    ext,
    data,
  };
};

export {
  getFixturePath,
  readFile,
};
