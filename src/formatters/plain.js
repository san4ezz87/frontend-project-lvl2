import _ from 'lodash/index.js';

const buildKey = (path, name) => [...path, name].join('.');
const buildValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plain = (tree) => {
  const iter = (treeIn, path) => {
    const nodesChanged = treeIn.flatMap((node) => {
      const pathStr = buildKey(path, node.key);

      if (node.type === 'added') {
        const value = buildValue(node.value);
        return `Property '${pathStr}' was added with value: ${value}`;
      }

      if (node.type === 'deleted') {
        return `Property '${pathStr}' was removed`;
      }

      if (node.type === 'changed') {
        const valueNew = buildValue(node.valueNew);
        const valueOld = buildValue(node.valueOld);
        return `Property '${pathStr}' was updated. From ${valueOld} to ${valueNew}`;
      }

      if (node.type === 'nested') {
        return iter(node.children, [...path, node.key]);
      }
      return [];
    });

    return nodesChanged;
  };

  const filteredNodes = iter(tree.children, []);

  return filteredNodes.join('\n');
};

export default plain;
