import getTypeOf from '../utils/getTypeOf.js';

const buildAST = (obj) => {
  const keys = Object.keys(obj);
  return keys.reduce((acc, key) => {
    const value = obj[key];
    const type = getTypeOf(value);

    if (type === 'Object') {
      const children = buildAST(value);
      return {
        ...acc,
        [key]: {
          name: key,
          type,
          children,
        },
      };
    }

    return {
      ...acc,
      [key]: {
        name: key,
        type,
        value,
      },
    };
  }, {});
};

export default buildAST;
