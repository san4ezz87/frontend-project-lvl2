import yaml from 'js-yaml';
import ini from 'ini';

export const parseFileToJsObject = (file) => {
  if (file.ext === '.json') {
    return JSON.parse(file.data);
  }

  if (file.ext === '.yml') {
    return yaml.safeLoad(file.data);
  }

  if (file.ext === '.ini') {
    return ini.parse(file.data);
  }
  return {};
};

const getTypeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);

export const buildAST = (obj) => {
  const keys = Object.keys(obj).sort();
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
          value: children,
        },
      };
    }

    if (type === 'Array') {
      return {
        ...acc,
        [key]: {
          name: key,
          type,
          value,
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

export const buildDiffAst = (first, second) => {
  const commonObj = {
    ...first,
    ...second,
  };
  const commonKeys = Object.keys(commonObj);
  const result = [];
  commonKeys.forEach((key) => {
    const firstElem = first[key];
    const secondElem = second[key];
    // console.log({firstElem, secondElem});
    if (!firstElem && secondElem) {
      const node = {
        ...secondElem,
        status: 'added',
      };
      result.push(node);
    } else if (firstElem && !secondElem) {
      const node = {
        ...firstElem,
        status: 'deleted',
      };
      result.push(node);
    } else if (firstElem.type === 'Object' && secondElem.type === 'Object') {
      const value = buildDiffAst(firstElem.value, secondElem.value);
      const node = {
        ...secondElem,
        value,
        status: 'notChanged',
      };
      result.push(node);
    } else if (firstElem.type === 'Array' && secondElem.type === 'Array') {
      const node = {
        ...firstElem,
        status: 'notChanged',
      };
      result.push(node);
    } else if (firstElem.value === secondElem.value) {
      const node = {
        ...secondElem,
        status: 'notChanged',
      };
      result.push(node);
    } else if (firstElem.value !== secondElem.value) {
      const node = {
        ...firstElem,
        status: 'deleted',
      };
      const node2 = {
        ...secondElem,
        status: 'added',
      };
      result.push(node, node2);
    }
  })

  return result;
};

export const parser = (firstObj, secondObj) => {
  const firstAstDiff = buildAST(firstObj);
  // console.log({ firstAstDiff })
  const secondTwoAstDiff = buildAST(secondObj);
  // console.log({ secondTwoAstDiff })
  // console.log(buildDiffAst(firstAstDiff, secondTwoAstDiff))
  return buildDiffAst(firstAstDiff, secondTwoAstDiff);
};
