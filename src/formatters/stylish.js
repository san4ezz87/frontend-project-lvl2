// import hasObjectKey from '../../utils/hasObjectKey.js';
import _ from 'lodash/index.js';

const stringify = (value, replacer = '   ', spacesCount = 1) => {
  if (typeof value !== 'object') {
    return value.toString();
  }

  const iter = (data, divider, depthLeve) => {
    const entries = Object.entries(data);
    const cumputedReplacer = divider.repeat(depthLeve);

    return entries.map(([key, content]) => {
      const newValue = typeof content === 'object' ? `{\n${iter(content, divider, depthLeve + 1).join('\n')}\n    ${cumputedReplacer}}` : content;
      return `    ${cumputedReplacer}${key}: ${newValue}`;
    });
  };

  const result = `${iter(value, replacer, spacesCount).join('\n')}`;
  return result;
};

const buildValue = (value, indention, depthLevel) => (_.isPlainObject(value) ? `{\n${stringify(value, '    ', depthLevel + 1)}\n    ${indention}}` : value);
const render = (indention, sign, key, value) => `${indention}${sign}${key}: ${value}`;

const stylish = (tree) => {
  const iter = (treeIn, depthLevel) => {
    const indentionUp = '    '.repeat(depthLevel);

    const statesHandlers = {
      deleted: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return render(indention, '  - ', node.name, value);
      },
      added: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return render(indention, '  + ', node.name, value);
      },
      changed: (node, indention, depthLeveI) => {
        const valueNew = buildValue(node.valueNew, indention, depthLeveI);
        const valueOld = buildValue(node.valueOld, indention, depthLeveI);
        const stringNew = render(indention, '  - ', node.name, valueOld);
        const stringOld = render(indention, '  + ', node.name, valueNew);
        return `${stringNew}\n${stringOld}`;
      },
      unchanged: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return render(indention, '    ', node.name, value);
      },
      nested: (node, indention, depthLeveI) => {
        const value = `{\n${iter(node.children, depthLeveI + 1)}\n    ${indention}}`;
        return render(indention, '    ', node.name, value);
      },
    };

    const res = treeIn.map((node) => statesHandlers[node.type](node, indentionUp, depthLevel)).join('\n');
    return res;
  };
  const result = iter(tree.children, 0);
  return `{\n${result}\n}`;
};

export default stylish;
