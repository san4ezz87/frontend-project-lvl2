import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFilePromise = (filename) => fs.promises.readFile(getFixturePath(filename), 'utf-8');

export {
  getFixturePath,
  readFilePromise,
};
