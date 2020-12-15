import _ from 'lodash/index.js';

const buildAst = (first, second) => {
  const keys = _.union(_.keys(first), _.keys(second));
  const sortedKyes = _.sortBy(keys);

  const result = sortedKyes.map((key) => {
    const firstElem = first[key];
    const secondElem = second[key];

    if (!_.has(first, key)) {
      return {
        name: key,
        state: 'added',
        valueNew: secondElem,
      };
    }
    if (!_.has(second, key)) {
      return {
        name: key,
        state: 'deleted',
        valueOld: firstElem,
      };
    }
    if (_.isPlainObject(firstElem) && _.isPlainObject(secondElem)) {
      const children = buildAst(
        firstElem,
        secondElem,
      );

      return {
        name: key,
        state: 'depth',
        children,
      };
    }
    if (firstElem !== secondElem) {
      return {
        name: key,
        state: 'changed',
        valueNew: secondElem,
        valueOld: firstElem,
      };
    }
    return {
      name: key,
      state: 'notChanged',
      valueOld: firstElem,
    };
  });
  return result;
};

export default buildAst;
