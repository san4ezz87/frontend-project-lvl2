import _ from 'lodash';

const buildIndention = (depthLevel, count = 4) => `${' '.repeat(depthLevel * count - 2)}`;

const stringify = (value, depth) => {
  const nodeEntries = Object.entries(value);
  const indention = buildIndention(depth);

  const result = nodeEntries.map(([key, content]) => {
    if (typeof content === 'object') {
      const handledContent = `{\n${stringify(content, depth + 1)}\n  ${indention}}`;
      return `${indention}  ${key}: ${handledContent}`;
    }

    return `${indention}  ${key}: ${content}`;
  });

  return `${result.join('\n')}`;
};

const buildValue = (value, indention, depthLevel) => {
  if (_.isPlainObject(value)) {
    return `{\n${stringify(value, depthLevel + 1)}\n  ${indention}}`;
  }
  return value;
};

const stylish = (tree) => {
  const iter = (treeIn, depthLevel) => {
    const resolveNodeHandler = (nodeType) => {
      switch (nodeType) {
        case 'root': {
          return (node, depthLevelI) => `{\n${iter(node.children, depthLevelI)}\n}`;
        }
        case 'deleted': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = buildValue(node.value, indention, depthLevelI);
            return `${indention}- ${node.key}: ${value}`;
          };
        }
        case 'added': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = buildValue(node.value, indention, depthLevelI);
            return `${indention}+ ${node.key}: ${value}`;
          };
        }
        case 'changed': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const valueNew = buildValue(node.valueNew, indention, depthLevelI);
            const valueOld = buildValue(node.valueOld, indention, depthLevelI);
            const stringNew = `${indention}- ${node.key}: ${valueOld}`;
            const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
            return `${stringNew}\n${stringOld}`;
          };
        }
        case 'unchanged': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = buildValue(node.value, indention, depthLevelI);
            return `${indention}  ${node.key}: ${value}`;
          };
        }
        case 'nested': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = `{\n${iter(node.children, depthLevelI + 1)}\n  ${indention}}`;
            return `${indention}  ${node.key}: ${value}`;
          };
        }
        default: {
          throw new Error(`Unknown node type ${nodeType}`);
        }
      }
    };

    const res = treeIn.map((node) => resolveNodeHandler(node.type)(node, depthLevel)).join('\n');
    return res;
  };
  return iter(tree, 1);
};

export default stylish;
