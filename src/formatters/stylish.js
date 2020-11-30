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

const buildkey = (indention, sign, name) => `${indention}${sign}${name}`;
const buildValue = (value, indention, indentionCount) => (isPlainObject(value) ? `{\n${stringify(value, '  ', indentionCount + 2)}\n  ${indention}}` : value);
const render = (key, value) => `${key}: ${value}`;

const stylish = (tree) => {
  const iter = (treeIn, indentionCount) => {
    const values = Object.values(treeIn).sort();
    const indention = '  '.repeat(indentionCount);

    const res = values.map((node) => {
      const hasChildren = has(node, 'children');
      const sign = signsMap[node.state];
      const key = buildkey(indention, sign, node.name);

      if (node.state === 'deleted') {
        const value = buildValue(node.valueOld, indention, indentionCount);
        return render(key, value);
      }

      if (node.state === 'added') {
        const value = buildValue(node.valueNew, indention, indentionCount);
        return render(key, value);
      }

      if (node.state === 'changed') {
        const valueNew = buildValue(node.valueNew, indention, indentionCount);
        const valueOld = buildValue(node.valueOld, indention, indentionCount);

        const changed = [];
        const keyOld = buildkey(indention, signsMap.deleted, node.name);
        const keyNew = buildkey(indention, signsMap.added, node.name);

        changed.push(render(keyOld, valueOld));
        changed.push(render(keyNew, valueNew));
        return changed.join('\n');
      }

      if (node.state === 'notChanged') {
        const value = buildValue(node.valueOld, indention, indentionCount);
        return render(key, value);
      }

      if (node.state === 'depth') {
        const value = hasChildren ? `{\n${iter(node.children, indentionCount + 2)}\n  ${indention}}` : node.valueOld;
        return render(key, value);
      }

      return render(key, node.value);
    }).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
