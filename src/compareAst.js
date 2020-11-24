import has from 'lodash/has.js';
import isPlainObject from 'lodash/isPlainObject.js';
import union from 'lodash/union.js';
import sortBy from 'lodash/sortBy';

const compareAst = (first, second) => {
  const keys = union(Object.keys(first), Object.keys(second));
  const sortedKyes = sortBy(keys);

  const result = sortedKyes.reduce((acc, key) => {
    const firstElem = first[key];
    const secondElem = second[key];

    if (!has(first, key) && has(second, key)) {
      return {
        ...acc,
        [key]: {
          name: key,
          state: 'added',
          valueNew: secondElem,
        },
      };
    }
    if (has(first, key) && !has(second, key)) {
      return {
        ...acc,
        [key]: {
          name: key,
          state: 'deleted',
          valueOld: firstElem,
        },
      };
    }
    if (isPlainObject(firstElem) && isPlainObject(secondElem)) {
      const children = compareAst(
        firstElem,
        secondElem,
      );

      return {
        ...acc,
        [key]: {
          name: key,
          state: 'depth',
          children,
        },
      };
    }
    if (firstElem !== secondElem) {
      return {
        ...acc,
        [key]: {
          name: key,
          state: 'changed',
          valueNew: secondElem,
          valueOld: firstElem,
        },
      };
    }
    return {
      ...acc,
      [key]: {
        name: key,
        state: 'notChanged',
        valueOld: firstElem,
      },
    };
  }, {});
  return result;
};

export default compareAst;
