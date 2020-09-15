const stylish = (tree) => {
  const res = tree.map((node) => {
    // console.log(node)
    if (node.type === 'Object' && node.status !== 'deleted') {
      return stylish(node.value);
    }

    if (node.status === 'deleted') {
      return `- ${node.name}: ${node.value}`;
    }

    if (node.status === 'added') {
      return `+ ${node.name}: ${node.value}`;
    }

    return ` ${node.name}: ${node.value}`;
  }).join('\n');

  return `{\n${res}\n}`;
};

// const node = {
//   name: '',
//   type: ['string', 'number', 'Object', 'Array', 'boolean', 'null', 'undefined'],
//   status: ['notChanged', 'deleted', 'added'],
//   value: '',
// }

export default stylish;
