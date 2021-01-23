import _ from 'lodash/index.js';

const buildAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const sortedKyes = _.sortBy(keys);

  return sortedKyes.map((key) => {
    const elem1 = obj1[key];
    const elem2 = obj2[key];

    if (!_.has(obj1, key)) {
      return {
        key,
        type: 'added',
        value: elem2,
      };
    }
    if (!_.has(obj2, key)) {
      return {
        key,
        type: 'deleted',
        value: elem1,
      };
    }
    if (_.isPlainObject(elem1) && _.isPlainObject(elem2)) {
      const children = buildAst(
        elem1,
        elem2,
      );
      return {
        key,
        type: 'nested',
        children,
      };
    }
    if (!_.isEqual(elem1, elem2)) {
      return {
        key,
        type: 'changed',
        valueNew: elem2,
        valueOld: elem1,
      };
    }
    return {
      key,
      type: 'unchanged',
      value: elem1,
    };
  });
};

export default (obj1, obj2) => ({
  type: 'root',
  children: buildAst(obj1, obj2),
});
