const signsMap = {
  deleted: '- ',
  added: '+ ',
  notChanged: '  ',
  undefined: '  ',
};

const stylish = (tree) => {
  const iter = (treeIn, indentionCount) => {
    const values = Object.values(treeIn).sort();
    const indention = '  '.repeat(indentionCount);
    const res = values.map((node) => {
      if (!node.status) {
        if (node.type === 'Object') {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.value, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap[node.status]}${node.name}: ${node.value}`;
      }

      if (node.type === 'Object') {
        return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.value, indentionCount + 2)}\n  ${indention}}`;
      }
      return `${indention}${signsMap[node.status]}${node.name}: ${node.value}`;
    }).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
