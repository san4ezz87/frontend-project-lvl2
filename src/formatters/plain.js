import isPlainObject from 'lodash/isPlainObject.js';

const chandedStatuses = ['changed', 'deleted', 'added'];

const buildKey = (path, name) => [...path, name].join('.');
const buildValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};
const render = (node) => {
  const path = buildKey(node.path, node.name);
  const valueOld = buildValue(node.valueOld);
  const valueNew = buildValue(node.valueNew);

  if (node.state === 'added') {
    return `Property '${path}' was added with value: ${valueNew}`;
  }

  if (node.state === 'deleted') {
    return `Property '${path}' was removed`;
  }

  return `Property '${path}' was updated. From ${valueOld} to ${valueNew}`;
};

const plain = (tree) => {
  const iter = (treeIn, accum, path) => {
    const nodes = Object.values(treeIn).sort();
    const nodesChanged = nodes.reduce((acc, node) => {
      const nodeWithPath = {
        ...node,
        path: [...path],
      };

      if (chandedStatuses.includes(nodeWithPath.state)) {
        return [...acc, nodeWithPath];
      }

      if (nodeWithPath.children) {
        return [...acc, ...iter(nodeWithPath.children, [], [...path, nodeWithPath.name])];
      }
      return [...acc];
    }, accum);
    return nodesChanged;
  };
  const filteredNodes = iter(tree, [], []);

  const result = filteredNodes.map(render);

  return result.join('\n');
};

export default plain;
