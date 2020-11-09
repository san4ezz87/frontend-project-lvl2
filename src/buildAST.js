import isPlainObject from 'lodash/isPlainObject.js';

const buildAST = (obj) => {
  const keys = Object.keys(obj);
  return keys.reduce((acc, key) => {
    const value = obj[key];

    if (isPlainObject(value)) {
      const children = buildAST(value);
      return {
        ...acc,
        [key]: {
          name: key,
          children,
        },
      };
    }

    return {
      ...acc,
      [key]: {
        name: key,
        value,
      },
    };
  }, {});
};

export default buildAST;
