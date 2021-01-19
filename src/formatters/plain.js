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

const iter = (nodeList, path) => {
  const nodesChanged = nodeList.flatMap((node) => {
    const pathStr = buildKey(path, node.key);

    switch (node.type) {
      case 'added': {
        const value = buildValue(node.value);
        return `Property '${pathStr}' was added with value: ${value}`;
      }

      case 'deleted': {
        return `Property '${pathStr}' was removed`;
      }

      case 'changed': {
        const valueNew = buildValue(node.valueNew);
        const valueOld = buildValue(node.valueOld);
        return `Property '${pathStr}' was updated. From ${valueOld} to ${valueNew}`;
      }

      case 'nested': {
        return iter(node.children, [...path, node.key]);
      }

      case 'unchanged': {
        return [];
      }

      default: {
        throw new Error(`Unknown node type ${node.type}`);
      }
    }
  });

  return nodesChanged;
};

const plain = (tree) => {
  if (tree.type === 'root') {
    const handledNodes = iter(tree.children, []);
    return handledNodes.join('\n');
  }

  throw new Error(`${tree.type} is not root element of the tree`);
};

export default plain;
