import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import ini from 'ini';
import isObjectLike from 'lodash/isObjectLike.js';
import mapValues from 'lodash/mapValues.js';
import isNaN from 'lodash/isNaN.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

// не могу использовать просто path потому что это имя уже испоьзуется
export const getDataFormat = (filePath) => path.extname(filePath).slice(1);

export const readFile = (pathString) => {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  return fs.readFileSync(compoosedPath, 'utf8');
};

const numberifyValues = (obj) => mapValues(obj, (value) => {
  if (isObjectLike(value)) {
    return numberifyValues(value);
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? value : parsed;
});
export const parseIni = (data) => numberifyValues(ini.parse(data));
