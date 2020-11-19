import isPlainObject from 'lodash/isPlainObject.js';

const chandedStatuses = ['changed', 'deleted', 'added'];

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

  const result = filteredNodes.map((node) => {
    const path = [...node.path, node.name].join('.');
    const valueOldTyped = typeof node.valueOld === 'string' ? `'${node.valueOld}'` : node.valueOld;
    const valueNewTyped = typeof node.valueNew === 'string' ? `'${node.valueNew}'` : node.valueNew;

    if (node.state === 'added') {
      const value = isPlainObject(node.valueNew) ? '[complex value]' : valueNewTyped;
      return `Property '${path}' was added with value: ${value}`;
    }

    if (node.state === 'deleted') {
      return `Property '${path}' was removed`;
    }

    const valueOldFinished = isPlainObject(valueOldTyped) ? '[complex value]' : valueOldTyped;
    const valueNewFinished = isPlainObject(valueNewTyped) ? '[complex value]' : valueNewTyped;

    return `Property '${path}' was updated. From ${valueOldFinished} to ${valueNewFinished}`;
  });

  return result.join('\n');
};

export default plain;
