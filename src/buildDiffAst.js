import hasObjectKey from '../utils/hasObjectKey.js';

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

    if (!hasObjectKey(first, key) && hasObjectKey(second, key)) {
      const children = { children: secondElem.children };
      const hasChildren = hasObjectKey(secondElem, 'children');

      const node = {
        name: secondElem.name,
        valueNew: secondElem.value,
        status: 'added',
        ...(hasChildren && children),
        parent,
      };
      result[key] = node;
    } else if (hasObjectKey(first, key) && !hasObjectKey(second, key)) {
      const children = { children: firstElem.children };
      const hasChildren = hasObjectKey(firstElem, 'children');

      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        status: 'deleted',
        ...(hasChildren && children),
        parent,
      };
      result[key] = node;
    } else if (hasObjectKey(firstElem, 'children') && hasObjectKey(secondElem, 'children')) {
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
    } else if (firstElem.value === secondElem.value) {
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        status: 'notChanged',
        parent,
      };

      result[key] = node;
    } else if (firstElem.value !== secondElem.value) {
      const children = { children: firstElem.children || secondElem.children };
      const hasChildren = hasObjectKey(firstElem, 'children') || hasObjectKey(secondElem, 'children');

      const valueOld = { valueOld: firstElem.value };
      const hasValueOld = hasObjectKey(firstElem, 'value');

      const valueNew = { valueNew: secondElem.value };
      const hasValueNew = hasObjectKey(secondElem, 'value');

      const node = {
        name: firstElem.name,
        ...(hasValueOld && valueOld),
        ...(hasValueNew && valueNew),
        status: 'changed',
        ...(hasChildren && children),
        parent,
      };
      result[key] = node;
    }
  });
  return result;
};

export default buildDiffAst;
