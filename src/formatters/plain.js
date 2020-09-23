const chandedStatuses = ['changed', 'deleted', 'added'];

const plain = (tree) => {
  const iter = (treeIn, accum) => {
    const nodes = Object.values(treeIn).sort();
    const nodesChanged = nodes.reduce((acc, node) => {
      if (chandedStatuses.includes(node.status)) {
        return [...acc, node];
      }

      if (node.type === 'Object' || node.typeOld === 'Object') {
        return [...acc, ...iter(node.valueOld, [])];
      }
      return [...acc];
    }, accum);
    return nodesChanged;
  };
  const filteredNodes = iter(tree, []);

  const result = filteredNodes.map((node) => {
    const path = [...node.parent, node.name].join('.');

    const valueOld = node.typeOld === 'Object' ? '[complex value]' : node.valueOld;
    const valueOldTyped = node.typeOld === 'String' ? `'${valueOld}'` : valueOld;

    const valueNew = node.typeNew === 'Object' ? '[complex value]' : node.valueNew;
    const valueNewTyped = node.typeNew === 'String' ? `'${valueNew}'` : valueNew;

    if (node.status === 'added') {
      return `Property '${path}' was added with value: ${valueNewTyped}`;
    }

    if (node.status === 'deleted') {
      return `Property '${path}' was removed`;
    }

    return `Property '${path}' was updated. From ${valueOldTyped} to ${valueNewTyped}`;
  });

  return result.join('\n');
};

export default plain;
