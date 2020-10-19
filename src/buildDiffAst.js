const buildDiffAst = (first, second, parent) => {
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

export default buildDiffAst;
