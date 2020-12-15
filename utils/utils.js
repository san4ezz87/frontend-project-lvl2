import fs from 'fs';
import path from 'path';

import ini from 'ini';
import _ from 'lodash/index.js';

// не могу использовать просто path потому что это имя уже испоьзуется
export const getDataFormat = (filePath) => path.extname(filePath).slice(1);

export const readFile = (pathString) => {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  return fs.readFileSync(compoosedPath, 'utf8');
};

const numberifyValues = (obj) => _.mapValues(obj, (value) => {
  if (_.isObjectLike(value)) {
    return numberifyValues(value);
  }
  const parsed = parseFloat(value);
  return _.isNaN(parsed) ? value : parsed;
});
export const parseIni = (data) => numberifyValues(ini.parse(data));
