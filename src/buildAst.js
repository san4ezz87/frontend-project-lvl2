import _ from 'lodash/index.js';

const buildAst = (obj1, obj2) => {
  const iter = (objIn1, objIn2) => {
    const keys = _.union(_.keys(objIn1), _.keys(objIn2));
    const sortedKyes = _.sortBy(keys);

    const result = sortedKyes.map((key) => {
      const elem1 = objIn1[key];
      const elem2 = objIn2[key];
      if (!_.has(objIn1, key)) {
        return {
          name: key,
          type: 'added',
          value: elem2,
        };
      }
      if (!_.has(objIn2, key)) {
        return {
          name: key,
          type: 'deleted',
          value: elem1,
        };
      }
      if (_.isPlainObject(elem1) && _.isPlainObject(elem2)) {
        const children = iter(
          elem1,
          elem2,
        );
        return {
          name: key,
          type: 'nested',
          children,
        };
      }
      if (!_.isEqual(elem1, elem2)) {
        return {
          name: key,
          type: 'changed',
          valueNew: elem2,
          valueOld: elem1,
        };
      }
      return {
        name: key,
        type: 'unchanged',
        value: elem1,
      };
    });
    return result;
  };

  return {
    name: 'root',
    children: iter(obj1, obj2),
  };
};

export default buildAst;
