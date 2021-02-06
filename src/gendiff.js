import path from 'path';
import fs from 'fs';
import parse from './parse.js';
import buildAst from './buildAst.js';
import format from './formatters/index.js';

const getFullPath = (pathString) => path.resolve(process.cwd(), pathString);

export const getFormat = (filePath) => path.extname(filePath).slice(1);

export const getData = (pathString) => {
  const data = fs.readFileSync(getFullPath(pathString), 'utf8');
  const type = getFormat(pathString);
  return parse(data, type);
};

const genDiff = (path1, path2, formateType) => {
  const data1 = getData(path1);
  const data2 = getData(path2);

  const ast = buildAst(data1, data2);
  return format(formateType, ast);
};

export default genDiff;
