import parse from './parse.js';
import buildDiffAst from './buildDiffAst.js';
import readFile from '../utils/readFile.js';
import getFormater from './formatters/index.js';

const genDiff = (firstPath, secondPath, formaterType) => {
  const first = readFile(firstPath);
  const second = readFile(secondPath);

  const format = getFormater(formaterType);
  const firstObj = parse(first);
  const secondObj = parse(second);
  const ast = buildDiffAst(firstObj, secondObj);
  return format(ast);
};

export default genDiff;
