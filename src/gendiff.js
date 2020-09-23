import {
  parser,
  parseFileToJsObject,
} from './parsers.js';

const genDiff = (first, second, formater) => {
  const firstObj = parseFileToJsObject(first);
  const secondObj = parseFileToJsObject(second);
  const ast = parser(firstObj, secondObj);
  // console.log(JSON.stringify(formater(ast), null, 2));
  return formater(ast);
};

export default genDiff;
