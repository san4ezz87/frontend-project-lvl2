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

export const buildDiffAst = (first, second, parent) => {
  const commonObj = {
    ...first,
    ...second,
  };
  const commonKeys = Object.keys(commonObj).sort();
  const result = {};
  commonKeys.forEach((key) => {
    const firstElem = first[key];
    const secondElem = second[key];
    // console.log({firstElem, secondElem});
    if (!firstElem && secondElem) {
      const node = {
        name: secondElem.name,
        typeOld: null,
        typeNew: secondElem.type,
        valueOld: null,
        valueNew: secondElem.value,
        status: 'added',
        parent,
      };
      result[key] = node;
    } else if (firstElem && !secondElem) {
      const node = {
        name: firstElem.name,
        typeOld: firstElem.type,
        typeNew: null,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'deleted',
        parent,
      };
      result[key] = node;
    } else if (firstElem.type === 'Object' && secondElem.type === 'Object') {
      const value = buildDiffAst(firstElem.value, secondElem.value, [...parent, firstElem.name]);
      const node = {
        name: firstElem.name,
        typeOld: firstElem.type,
        typeNew: null,
        valueOld: value,
        valueNew: null,
        status: 'notChanged',
        parent,
      };
      result[key] = node;
    } else if (firstElem.type === 'Array' && secondElem.type === 'Array') {
      const node = {
        name: firstElem.name,
        typeOld: firstElem.type,
        typeNew: null,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'notChanged',
        parent,
      };
      result[key] = node;
    } else if (firstElem.value === secondElem.value) {
      const node = {
        name: firstElem.name,
        typeOld: firstElem.type,
        typeNew: null,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'notChanged',
        parent,
      };

      result[key] = node;
    } else if (firstElem.value !== secondElem.value) {
      const node = {
        name: firstElem.name,
        typeOld: firstElem.type,
        typeNew: secondElem.type,
        valueOld: firstElem.value,
        valueNew: secondElem.value,
        status: 'changed',
        parent,
      };
      result[key] = node;
    }
  });
  return result;
};

export const parser = (firstObj, secondObj) => {
  const firstAstDiff = buildAST(firstObj);
  const secondTwoAstDiff = buildAST(secondObj);
  return buildDiffAst(firstAstDiff, secondTwoAstDiff, []);
};
