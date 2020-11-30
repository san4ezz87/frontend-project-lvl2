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

const buildKey = (indention, sign, name, value) => `${indention}${sign}${name}: ${value}`;

const stylish = (tree) => {
  const iter = (treeIn, indentionCount) => {
    const values = Object.values(treeIn).sort();
    const indention = '  '.repeat(indentionCount);

    const res = values.map((node) => {
      const hasChildren = has(node, 'children');
      const sign = signsMap[node.state];

      if (node.state === 'deleted') {
        const value = isPlainObject(node.valueOld) ? `{\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}` : node.valueOld;
        return buildKey(indention, sign, node.name, value);
      }

      if (node.state === 'added') {
        const value = isPlainObject(node.valueNew) ? `{\n${stringify(node.valueNew, '  ', indentionCount + 2)}\n  ${indention}}` : node.valueNew;
        return buildKey(indention, sign, node.name, value);
      }

      if (node.state === 'changed') {
        if (isPlainObject(node.valueNew)) {
          const valueNew = `{\n${stringify(node.valueNew, '  ', indentionCount + 2)}\n    ${indention}}`;
          const changed = [];
          changed.push(buildKey(indention, sign, node.name, node.valueOld));
          changed.push(buildKey(indention, sign, node.name, valueNew));
          return changed.join('\n');
        }

        if (isPlainObject(node.valueOld)) {
          const changed = [];
          const valueOld = `{\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}`;

          changed.push(buildKey(indention, signsMap.deleted, node.name, valueOld));
          changed.push(buildKey(indention, signsMap.added, node.name, node.valueNew));
          return changed.join('\n');
        }

        const changed = [];
        changed.push(buildKey(indention, signsMap.deleted, node.name, node.valueOld));
        changed.push(buildKey(indention, signsMap.added, node.name, node.valueNew));

        return changed.join('\n');
      }

      if (node.state === 'notChanged') {
        const value = isPlainObject(node.valueOld) ? `{\n${stringify(node.valueOld, '  ', indentionCount + 2)}\n  ${indention}}` : node.valueOld || node.value;
        return buildKey(indention, sign, node.name, value);
      }

      if (node.state === 'depth') {
        const value = hasChildren ? `{\n${iter(node.children, indentionCount + 2)}\n  ${indention}}` : node.valueOld || node.value;
        return buildKey(indention, sign, node.name, value);
      }

      return buildKey(indention, sign, node.name, node.value);
    }).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
