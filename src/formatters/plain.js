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

const iter = (node, path) => {
  const pathStr = buildKey(path, node.key);

  switch (node.type) {
    case 'root': {
      return node.children.flatMap((child) => iter(child, '')).join('\n');
    }
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
  const res = iter(tree, []);
  return res;
};

export default plain;
