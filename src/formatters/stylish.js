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
      if (node.typeNew === 'Object' || node.typeOld === 'Object') {
        if (node.status === 'deleted') {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.valueOld, indentionCount + 2)}\n  ${indention}}`;
        }

        if (node.status === 'added') {
          return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.valueNew, indentionCount + 2)}\n  ${indention}}`;
        }

        if (node.status === 'changed') {
          const changed = [];
          if (node.typeOld === 'Object') {
            changed.push(`${indention}${signsMap.deleted}${node.name}: {\n${iter(node.valueOld, indentionCount + 2)}\n  ${indention}}`);
          }

          if (node.typeOld !== 'Object') {
            changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
          }

          if (node.typeNew === 'Object') {
            changed.push(`${indention}${signsMap.added}${node.name}: {\n${iter(node.valueNew, indentionCount + 2)}\n  ${indention}}`);
          }

          if (node.typeNew !== 'Object') {
            changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
          }
          return changed.join('\n');
        }
        return `${indention}${signsMap[node.status]}${node.name}: {\n${iter(node.valueOld, indentionCount + 2)}\n  ${indention}}`;
      }

      if (node.status === 'deleted') {
        return `${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`;
      }

      if (node.status === 'added') {
        return `${indention}${signsMap.added}${node.name}: ${node.valueNew}`;
      }

      if (node.status === 'changed') {
        const changed = [];
        changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
        changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
        return changed.join('\n');
      }

      if (node.status === 'notChanged') {
        return `${indention}${signsMap[node.status]}${node.name}: ${node.valueOld}`;
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
