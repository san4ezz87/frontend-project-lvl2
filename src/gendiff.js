import path from 'path';
import fs from 'fs';
import parse from './parse.js';
import buildAst from './buildAst.js';
import formate from './formatters/index.js';

const getFullPath = (pathString) => path.resolve(process.cwd(), pathString);

export const getFormat = (filePath) => path.extname(filePath).slice(1);

export const readFile = (pathString) => {
  const data = fs.readFileSync(getFullPath(pathString), 'utf8');
  const type = getFormat(pathString);
  return parse(data, type);
};

const genDiff = (path1, path2, formateType) => {
  try {
    const obj1 = readFile(path1);
    const obj2 = readFile(path2);

    const ast = buildAst(obj1, obj2);
    return formate(formateType, ast);
  } catch (e) {
    console.error(e);
    return '';
  }
};

export default genDiff;
