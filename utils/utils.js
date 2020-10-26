import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

export const getDataFormat = (pathString) => path.extname(pathString).split('.').slice(1)[0];

export const readFile = (pathString) => {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  return fs.readFileSync(compoosedPath, 'utf8');
};
