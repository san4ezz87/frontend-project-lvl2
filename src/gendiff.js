import parseFileToJsObject from './parseFileToJsObject.js';
import parse from './parsers.js';
import readFile from '../utils/readFile.js';
import getFormater from './formatters/index.js';

const genDiff = (firstPath, secondPath, formaterType) => {
  const first = readFile(firstPath);
  const second = readFile(secondPath);

  const format = getFormater(formaterType);
  const firstObj = parseFileToJsObject(first);
  const secondObj = parseFileToJsObject(second);
  const ast = parse(firstObj, secondObj);
  return format(ast);
};

export default genDiff;
