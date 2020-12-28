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

const render = (node) => {
  const path = buildKey(node.path, node.name);

  if (node.type === 'added') {
    const value = buildValue(node.value);
    return `Property '${path}' was added with value: ${value}`;
  }

  if (node.type === 'deleted') {
    return `Property '${path}' was removed`;
  }

  if (node.type === 'changed') {
    const valueNew = buildValue(node.valueNew);
    const valueOld = buildValue(node.valueOld);
    return `Property '${path}' was updated. From ${valueOld} to ${valueNew}`;
  }
  return '';
};

const plain = (tree) => {
  const iter = (treeIn, path) => {
    const nodesChanged = treeIn.flatMap((node) => {
      const nodeWithPath = {
        ...node,
        path: [...path],
      };

      if (nodeWithPath.type === 'nested') {
        return iter(nodeWithPath.children, [...path, nodeWithPath.name]);
      }
      return nodeWithPath;
    });

    return nodesChanged;
  };

  const filteredNodes = iter(tree.children, []);

  const result = filteredNodes.map(render).filter((node) => node);

  return result.join('\n');
};

export default plain;
