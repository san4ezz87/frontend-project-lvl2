import has from 'lodash/has.js';
import isPlainObject from 'lodash/isPlainObject.js';
import union from 'lodash/union.js';
import sortBy from 'lodash/sortBy';

const createNode = (name, state, valueNew, valueOld, children) => ({
  ...(name !== undefined && { name }),
  ...(state !== undefined && { state }),
  ...(valueNew !== undefined && { valueNew }),
  ...(valueOld !== undefined && { valueOld }),
  ...(children !== undefined && { children }),
});

const compareAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const sortedKyes = sortBy(keys);

  const result = sortedKyes.reduce((acc, key) => {
    const firstElem = first[key];
    const secondElem = second[key];

    if (!has(first, key) && has(second, key)) {
      return {
        ...acc,
        [key]: createNode(key, 'added', secondElem, undefined, undefined),
      };
    }
    if (has(first, key) && !has(second, key)) {
      return {
        ...acc,
        [key]: createNode(key, 'deleted', undefined, firstElem, undefined),
      };
    }
    if (isPlainObject(firstElem) && isPlainObject(secondElem)) {
      const children = compareAst(
        firstElem,
        secondElem,
      );
      return {
        ...acc,
        [key]: createNode(key, 'depth', undefined, undefined, children),
      };
    }
    if (firstElem !== secondElem) {
      return {
        ...acc,
        [key]: createNode(key, 'changed', secondElem, firstElem, undefined),
      };
    }
    return {
      ...acc,
      [key]: createNode(key, 'notChanged', undefined, firstElem, undefined),
    };
  }, {});
  return result;
};

export default compareAst;
