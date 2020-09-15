import {
  parser,
  parseFileToJsObject,
} from './parsers.js';

import stylish from './formaters.js';

// const node = {
//   name: '',
//   type: ['string', 'number', 'Object', 'Array', 'boolean', 'null', 'undefined'],
//   status: ['notChanged', 'deleted', 'added', 'changed'],
//   value: '',
// }

const genDiff = (first, second) => {
  const firstObj = parseFileToJsObject(first);
  const secondObj = parseFileToJsObject(second);
  const ast = parser(firstObj, secondObj);
  return stylish(ast);
};

export default genDiff;
