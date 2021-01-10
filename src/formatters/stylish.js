import _ from 'lodash/index.js';

const buildIndention = (depthLeve, divider = ' ', count = 4) => (`  ${divider.repeat(count).repeat(depthLeve)}`);

const stringify = (value, depth = 1) => {
  if (typeof value !== 'object') {
    return value.toString();
  }

  const iter = (data, depthLevel) => {
    const entries = Object.entries(data);
    const indention = buildIndention(depthLevel);

    return entries.map(([key, content]) => {
      const newValue = typeof content === 'object' ? `{\n${iter(content, depthLevel + 1).join('\n')}\n  ${indention}}` : content;
      return `  ${indention}${key}: ${newValue}`;
    });
  };

  const result = `${iter(value, depth).join('\n')}`;
  return result;
};

const buildValue = (value, indention, depthLevel) => (_.isPlainObject(value) ? `{\n${stringify(value, depthLevel + 1)}\n  ${indention}}` : value);

const stylish = (tree) => {
  const iter = (treeIn, depthLevel) => {
    const cumputedIndention = buildIndention(depthLevel);

    const statesHandlers = {
      deleted: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return `${indention}- ${node.key}: ${value}`;
      },
      added: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return `${indention}+ ${node.key}: ${value}`;
      },
      changed: (node, indention, depthLeveI) => {
        const valueNew = buildValue(node.valueNew, indention, depthLeveI);
        const valueOld = buildValue(node.valueOld, indention, depthLeveI);
        const stringNew = `${indention}- ${node.key}: ${valueOld}`;
        const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
        return `${stringNew}\n${stringOld}`;
      },
      unchanged: (node, indention, depthLeveI) => {
        const value = buildValue(node.value, indention, depthLeveI);
        return `${indention}  ${node.key}: ${value}`;
      },
      nested: (node, indention, depthLeveI) => {
        const value = `{\n${iter(node.children, depthLeveI + 1)}\n  ${indention}}`;
        return `${indention}  ${node.key}: ${value}`;
      },
    };

    const res = treeIn.map((node) => statesHandlers[node.type](node, cumputedIndention, depthLevel)).join('\n');
    return res;
  };
  const result = iter(tree.children, 0);
  return `{\n${result}\n}`;
};

export default stylish;
