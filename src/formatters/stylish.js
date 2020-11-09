// import hasObjectKey from '../../utils/hasObjectKey.js';
import has from 'lodash/has.js';

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
      const hasChildren = has(node, 'children');
      const hasValueNew = has(node, 'valueNew');
      const hasValueOld = has(node, 'valueOld');

      if (node.state === 'deleted') {
        if (hasChildren) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`;
      }

      if (node.state === 'added') {
        if (hasChildren) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.added}${node.name}: ${node.valueNew}`;
      }

      if (node.state === 'changed') {
        if (hasChildren && hasValueOld) {
          const changed = [];
          changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
          changed.push(`${indention}${signsMap.added}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`);
          return changed.join('\n');
        }

        if (hasChildren && hasValueNew) {
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

      if (node.state === 'notChanged' || !node.state) {
        if (hasChildren) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${iter(node.children, indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap[node.state]}${node.name}: ${node.valueOld || node.value}`;
      }

      return `${indention}${signsMap[node.state]}${node.name}: ${node.value}`;
    }).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
