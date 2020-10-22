const chandedStatuses = ['changed', 'deleted', 'added'];

const plain = (tree) => {
  const iter = (treeIn, accum) => {
    const nodes = Object.values(treeIn).sort();
    const nodesChanged = nodes.reduce((acc, node) => {
      if (chandedStatuses.includes(node.status)) {
        return [...acc, node];
      }

      if (node.children) {
        return [...acc, ...iter(node.children, [])];
      }
      return [...acc];
    }, accum);
    return nodesChanged;
  };
  const filteredNodes = iter(tree, []);

  const result = filteredNodes.map((node) => {
    const path = [...node.parent, node.name].join('.');

    const valueOldTyped = typeof node.valueOld === 'string' ? `'${node.valueOld}'` : node.valueOld;
    const valueNewTyped = typeof node.valueNew === 'string' ? `'${node.valueNew}'` : node.valueNew;


    if (node.status === 'added') {
      const value = node.children ? '[complex value]' : valueNewTyped;
      return `Property '${path}' was added with value: ${value}`;
    }

    if (node.status === 'deleted') {
      return `Property '${path}' was removed`;
    }

    if (node.children && node.valueOld) {
      return `Property '${path}' was updated. From ${valueOldTyped} to [complex value]`;
    }

    if (node.children && node.valueNew) {
      return `Property '${path}' was updated. From [complex value] to ${valueNewTyped}`;
    }

    return `Property '${path}' was updated. From ${valueOldTyped} to ${valueNewTyped}`;
  });

  return result.join('\n');
};

export default plain;
