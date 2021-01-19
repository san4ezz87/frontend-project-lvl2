import _ from 'lodash';

const buildIndention = (depthLevel, count = 4) => `${' '.repeat(depthLevel * count)}`.slice(2);

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value.toString();
  }

  const iter = (data, depthLevel) => {
    const nodeEntries = Object.entries(data);
    const indention = buildIndention(depthLevel);

    return nodeEntries.map(([key, content]) => {
      if (typeof content === 'object') {
        const handledContent = `{\n${iter(content, depthLevel + 1).join('\n')}\n  ${indention}}`;
        return `${indention}  ${key}: ${handledContent}`;
      }

      return `${indention}  ${key}: ${content}`;
    });
  };

  const result = `${iter(value, depth).join('\n')}`;
  return result;
};

const buildValue = (value, indention, depthLevel) => {
  if (_.isPlainObject(value)) {
    return `{\n${stringify(value, depthLevel + 1)}\n  ${indention}}`;
  }
  return value;
};

const stylish = (tree) => {
  const iter = (treeIn, depthLevel) => {
    const statesHandlers = {
      deleted: (node, depthLevelI) => {
        const indention = buildIndention(depthLevelI);
        const value = buildValue(node.value, indention, depthLevelI);
        return `${indention}- ${node.key}: ${value}`;
      },
      added: (node, depthLevelI) => {
        const indention = buildIndention(depthLevelI);
        const value = buildValue(node.value, indention, depthLevelI);
        return `${indention}+ ${node.key}: ${value}`;
      },
      changed: (node, depthLevelI) => {
        const indention = buildIndention(depthLevelI);
        const valueNew = buildValue(node.valueNew, indention, depthLevelI);
        const valueOld = buildValue(node.valueOld, indention, depthLevelI);
        const stringNew = `${indention}- ${node.key}: ${valueOld}`;
        const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
        return `${stringNew}\n${stringOld}`;
      },
      unchanged: (node, depthLevelI) => {
        const indention = buildIndention(depthLevelI);
        const value = buildValue(node.value, indention, depthLevelI);
        return `${indention}  ${node.key}: ${value}`;
      },
      nested: (node, depthLevelI) => {
        const indention = buildIndention(depthLevelI);
        const value = `{\n${iter(node.children, depthLevelI + 1)}\n  ${indention}}`;
        return `${indention}  ${node.key}: ${value}`;
      },
    };

    const res = treeIn.map((node) => statesHandlers[node.type](node, depthLevel)).join('\n');
    return res;
  };
  const result = iter(tree.children, 1);
  return `{\n${result}\n}`;
};

export default stylish;
