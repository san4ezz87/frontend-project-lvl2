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
        valueOld: null,
        valueNew: secondElem.value,
        status: 'added',
        children: secondElem.children,
        parent,
      };
      result[key] = node;
    } else if (firstElem && !secondElem) {
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'deleted',
        children: firstElem.children,
        parent,
      };
      result[key] = node;
    } else if (firstElem.children && secondElem.children) {
      const children = buildDiffAst(
        firstElem.children,
        secondElem.children,
        [...parent, firstElem.name],
      );
      const node = {
        name: firstElem.name,
        status: 'notChanged',
        children,
        parent,
      };
      result[key] = node;
    } else if (firstElem.type === 'Array') {
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'notChanged',
        parent,
      };
      result[key] = node;
    } else if (firstElem.value === secondElem.value) {
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        valueNew: null,
        status: 'notChanged',
        parent,
      };

      result[key] = node;
    } else if (firstElem.value !== secondElem.value) {
      const children = firstElem.children || secondElem.children;
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        valueNew: secondElem.value,
        status: 'changed',
        children,
        parent,
      };
      result[key] = node;
    }
  });
  return result;
};

export default buildDiffAst;
