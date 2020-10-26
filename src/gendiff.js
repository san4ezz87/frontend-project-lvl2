import parse from './parse.js';
import buildDiffAst from './buildDiffAst.js';
import { readFile, getDataFormat } from '../utils/utils.js';
import getFormater from './formatters/index.js';

const genDiff = (firstPath, secondPath, formaterType) => {
  const first = readFile(firstPath);
  const second = readFile(secondPath);

  const format = getFormater(formaterType);

  const firstType = getDataFormat(firstPath);
  const secondType = getDataFormat(secondPath);

  const firstObj = parse(first, firstType);
  const secondObj = parse(second, secondType);

  const ast = buildDiffAst(firstObj, secondObj);
  return format(ast);
};

export default genDiff;
