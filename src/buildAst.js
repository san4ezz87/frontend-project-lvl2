import _ from 'lodash/index.js';

const buildAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const sortedKyes = _.sortBy(keys);

  const result = sortedKyes.map((key) => {
    const elem1 = obj1[key];
    const elem2 = obj2[key];

    if (!_.has(obj1, key)) {
      return {
        name: key,
        state: 'added',
        valueNew: elem2,
      };
    }
    if (!_.has(obj2, key)) {
      return {
        name: key,
        state: 'deleted',
        valueOld: elem1,
      };
    }
    if (_.isPlainObject(elem1) && _.isPlainObject(elem2)) {
      const children = buildAst(
        elem1,
        elem2,
      );

      return {
        name: key,
        state: 'incomparable',
        children,
      };
    }
    if (elem1 !== elem2) {
      return {
        name: key,
        state: 'changed',
        valueNew: elem2,
        valueOld: elem1,
      };
    }
    return {
      name: key,
      state: 'unchanged',
      valueOld: elem1,
    };
  });
  return result;
};

export default buildAst;
