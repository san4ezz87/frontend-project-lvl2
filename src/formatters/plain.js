import _ from 'lodash/index.js';

const getFullPath = (path, name) => [...path, name].join('.');
const stringify = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const iter = (node, path) => {
  switch (node.type) {
    case 'root': {
      return node.children.flatMap((child) => iter(child, ''));
    }
    case 'added': {
      const value = stringify(node.value);
      const pathStr = getFullPath(path, node.key);
      return `Property '${pathStr}' was added with value: ${value}`;
    }

    case 'deleted': {
      const pathStr = getFullPath(path, node.key);
      return `Property '${pathStr}' was removed`;
    }

    case 'changed': {
      const valueNew = stringify(node.valueNew);
      const valueOld = stringify(node.valueOld);
      const pathStr = getFullPath(path, node.key);
      return `Property '${pathStr}' was updated. From ${valueOld} to ${valueNew}`;
    }

    case 'nested': {
      return node.children.flatMap((child) => iter(child, [...path, node.key]));
    }

    case 'unchanged': {
      return [];
    }

    default: {
      throw new Error(`Unknown node type ${node.type}`);
    }
  }
};

const plain = (tree) => {
  const res = iter(tree, []).join('\n');
  return res;
};

export default plain;
