// import hasObjectKey from '../../utils/hasObjectKey.js';
import has from 'lodash/has.js';
import isPlainObject from 'lodash/isPlainObject.js';

const signsMap = {
  deleted: '- ',
  added: '+ ',
  notChanged: '  ',
  undefined: '  ',
  depth: '  ',
};

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  if (typeof value !== 'object') {
    return value.toString();
  }

  const iter = (data, divider, repeaterCount) => {
    const entries = Object.entries(data);
    const cumputeReplacer = divider.repeat(repeaterCount);

    return entries.map(([key, content]) => {
      const newValue = typeof content === 'object' ? `{\n${iter(content, divider, repeaterCount + 2).join('\n')}\n  ${cumputeReplacer}}` : content;
      return `  ${cumputeReplacer}${key}: ${newValue}`;
    });
  };

  const result = `${iter(value, replacer, spacesCount).join('\n')}`;
  return result;
};

const stylish = (tree) => {
  const iter = (treeIn, indentionCount) => {
    const values = Object.values(treeIn).sort();
    const indention = '  '.repeat(indentionCount);
    const res = values.map((node) => {
      const hasChildren = has(node, 'children');

      if (node.state === 'deleted') {
        if (isPlainObject(node.valueOld)) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`;
      }

      if (node.state === 'added') {
        if (isPlainObject(node.valueNew)) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${stringify(node.valueNew, '  ', indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap.added}${node.name}: ${node.valueNew}`;
      }

      if (node.state === 'changed') {
        if (isPlainObject(node.valueNew)) {
          const changed = [];
          changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
          changed.push(`${indention}${signsMap.added}${node.name}: {\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n    ${indention}}`);
          return changed.join('\n');
        }

        if (isPlainObject(node.valueOld)) {
          const changed = [];
          changed.push(`${indention}${signsMap.deleted}${node.name}: {\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}`);
          changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
          return changed.join('\n');
        }

        const changed = [];
        changed.push(`${indention}${signsMap.deleted}${node.name}: ${node.valueOld}`);
        changed.push(`${indention}${signsMap.added}${node.name}: ${node.valueNew}`);
        return changed.join('\n');
      }

      if (node.state === 'notChanged') {
        if (isPlainObject(node.valueOld)) {
          return `${indention}${signsMap[node.state]}${node.name}: {\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}`;
        }
        return `${indention}${signsMap[node.state]}${node.name}: ${node.valueOld || node.value}`;
      }

      if (node.state === 'depth') {
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
