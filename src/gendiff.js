import path from 'path';
import fs from 'fs';
import parse from './parse.js';
import buildAst from './buildAst.js';
import getFormater from './formatters/index.js';

export const getDataFormat = (filePath) => path.extname(filePath).slice(1);

export const readFile = (pathString) => {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  return fs.readFileSync(compoosedPath, 'utf8');
};

const genDiff = (path1, path2, formaterType) => {
  try {
    const data1 = readFile(path1);
    const data2 = readFile(path2);

    const type1 = getDataFormat(path1);
    const type2 = getDataFormat(path2);

    const obj1 = parse(data1, type1);
    const obj2 = parse(data2, type2);

    const ast = buildAst(obj1, obj2);
    return getFormater(formaterType)(ast);
  } catch (e) {
    console.error(e.message);
    return '';
  }
};

export default genDiff;
