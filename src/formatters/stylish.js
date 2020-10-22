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
      if (node.status === 'deleted') {
        if (node.children) {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`;
      }

      if (node.status === 'added') {
        if (node.children) {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.added}${node.name}: ${node.valueNew}`;
      }

      if (node.status === 'changed') {
        if (node.children && node.valueOld) {
          const changed = [];
          changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
          changed.push(`${indention}${signsMap.added}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`);
          return changed.join('\n');
        }

        if (node.children && node.valueNew) {
          const changed = [];
          changed.push(`${indention}${signsMap.deleted}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`);
          changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
          return changed.join('\n');
        }

        const changed = [];
        changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
        changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
        return changed.join('\n');
      }

      if (node.status === 'notChanged' || !node.status) {
        if (node.children) {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap[node.status]}${node.name}: ${node.valueOld || node.value}`;
      }

      return `${indention}${signsMap[node.status]}${node.name}: ${node.value}`;
    }).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
