import has from 'lodash/has.js';

const compareAst = (first, second) => {
  const commonObj = {
    ...first,
    ...second,
  };
  const commonKeys = Object.keys(commonObj).sort();
  const result = {};
  commonKeys.forEach((key) => {
    const firstElem = first[key];
    const secondElem = second[key];
    if (!has(first, key) && has(second, key)) {
      const children = { children: secondElem.children };
      const hasChildren = has(secondElem, 'children');

      const node = {
        name: secondElem.name,
        valueNew: secondElem.value,
        state: 'added',
        ...(hasChildren && children),
      };
      result[key] = node;
    } else if (has(first, key) && !has(second, key)) {
      const children = { children: firstElem.children };
      const hasChildren = has(firstElem, 'children');

      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        state: 'deleted',
        ...(hasChildren && children),
      };
      result[key] = node;
    } else if (has(firstElem, 'children') && has(secondElem, 'children')) {
      const children = compareAst(
        firstElem.children,
        secondElem.children,
      );
      const node = {
        name: firstElem.name,
        state: 'notChanged',
        children,
      };
      result[key] = node;
    } else if (firstElem.value === secondElem.value) {
      const node = {
        name: firstElem.name,
        valueOld: firstElem.value,
        state: 'notChanged',
      };

      result[key] = node;
    } else if (firstElem.value !== secondElem.value) {
      const children = { children: firstElem.children || secondElem.children };
      const hasChildren = has(firstElem, 'children') || has(secondElem, 'children');

      const valueOld = { valueOld: firstElem.value };
      const hasValueOld = has(firstElem, 'value');

      const valueNew = { valueNew: secondElem.value };
      const hasValueNew = has(secondElem, 'value');

      const node = {
        name: firstElem.name,
        ...(hasValueOld && valueOld),
        ...(hasValueNew && valueNew),
        state: 'changed',
        ...(hasChildren && children),
      };
      result[key] = node;
    }
  });
  return result;
};

export default compareAst;
