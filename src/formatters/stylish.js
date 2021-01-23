import _ from 'lodash';

const buildIndention = (depthLevel, count = 4) => `${' '.repeat(depthLevel * count - 2)}`;

const stringify = (value, depth) => {
  if (_.isPlainObject(value)) {
    const nodeEntries = Object.entries(value);
    const indention = buildIndention(depth + 1);

    const result = nodeEntries.map(([key, content]) => {
      if (typeof content === 'object') {
        const handledContent = `${stringify(content, depth + 1)}`;
        return `${indention}  ${key}: ${handledContent}`;
      }

      return `${indention}  ${key}: ${content}`;
    });

    return `{\n${result.join('\n')}\n  ${buildIndention(depth)}}`;
  }
  return value;
};

const stylish = (tree) => {
  const iter = (treeIn, depthLevel) => {
    const resolveNodeHandler = (nodeType) => {
      switch (nodeType) {
        case 'root': {
          return (node, depthLevelI) => `{\n${node.children.map((child) => iter(child, depthLevelI)).join('\n')}\n}`;
        }
        case 'deleted': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = stringify(node.value, depthLevelI);
            return `${indention}- ${node.key}: ${value}`;
          };
        }
        case 'added': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = stringify(node.value, depthLevelI);
            return `${indention}+ ${node.key}: ${value}`;
          };
        }
        case 'changed': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const valueNew = stringify(node.valueNew, depthLevelI);
            const valueOld = stringify(node.valueOld, depthLevelI);
            const stringNew = `${indention}- ${node.key}: ${valueOld}`;
            const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
            return `${stringNew}\n${stringOld}`;
          };
        }
        case 'unchanged': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = stringify(node.value, depthLevelI);
            return `${indention}  ${node.key}: ${value}`;
          };
        }
        case 'nested': {
          return (node, depthLevelI) => {
            const indention = buildIndention(depthLevelI);
            const value = `{\n${node.children.map((child) => iter(child, depthLevelI + 1)).join('\n')}\n  ${indention}}`;
            return `${indention}  ${node.key}: ${value}`;
          };
        }
        default: {
          throw new Error(`Unknown node type ${nodeType}`);
        }
      }
    };

    const res = resolveNodeHandler(treeIn.type)(treeIn, depthLevel);
    return res;
  };
  return iter(tree, 1);
};

export default stylish;
