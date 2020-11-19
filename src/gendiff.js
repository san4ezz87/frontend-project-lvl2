import parse from './parse.js';
import { readFile, getDataFormat } from '../utils/utils.js';
import compareAst from './compareAst.js';
import getFormater from './formatters/index.js';

const genDiff = (firstPath, secondPath, formaterType) => {
  try {
    const first = readFile(firstPath);
    const second = readFile(secondPath);

    const format = getFormater(formaterType);

    const firstType = getDataFormat(firstPath);
    const secondType = getDataFormat(secondPath);

    const firstObj = parse(first, firstType);
    const secondObj = parse(second, secondType);

    const ast = compareAst(firstObj, secondObj);
    return format(ast);
  } catch (e) {
    console.error(e.message);
    return '';
  }
};

export default genDiff;
