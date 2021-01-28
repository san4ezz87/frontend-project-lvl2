import _ from 'lodash';

const buildIndention = (depthLevel, count = 4) => ' '.repeat(depthLevel * count - 2);

const stringify = (value, depth) => {
  if (_.isPlainObject(value)) {
    const nodeEntries = Object.entries(value);
    const indention = buildIndention(depth + 1);

    const result = nodeEntries.map(([key, content]) => {
      const handledContent = `${stringify(content, depth + 1)}`;
      return `${indention}  ${key}: ${handledContent}`;
    });

    return `{\n${result.join('\n')}\n${buildIndention(depth)}  }`;
  }
  return value;
};

const stylish = (tree) => {
  const iter = (node, depthLevel) => {
    switch (node.type) {
      case 'root': {
        return `{\n${node.children.map((child) => iter(child, depthLevel + 1)).join('\n')}\n}`;
      }
      case 'deleted': {
        const indention = buildIndention(depthLevel);
        const value = stringify(node.value, depthLevel);
        return `${indention}- ${node.key}: ${value}`;
      }
      case 'added': {
        const indention = buildIndention(depthLevel);
        const value = stringify(node.value, depthLevel);
        return `${indention}+ ${node.key}: ${value}`;
      }
      case 'changed': {
        const indention = buildIndention(depthLevel);
        const valueNew = stringify(node.valueNew, depthLevel);
        const valueOld = stringify(node.valueOld, depthLevel);
        const stringNew = `${indention}- ${node.key}: ${valueOld}`;
        const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
        return `${stringNew}\n${stringOld}`;
      }
      case 'unchanged': {
        const indention = buildIndention(depthLevel);
        const value = stringify(node.value, depthLevel);
        return `${indention}  ${node.key}: ${value}`;
      }
      case 'nested': {
        const indention = buildIndention(depthLevel);
        const value = `{\n${node.children.map((child) => iter(child, depthLevel + 1)).join('\n')}\n${indention}  }`;
        return `${indention}  ${node.key}: ${value}`;
      }
      default: {
        throw new Error(`Unknown node type ${node.type}`);
      }
    }
  };
  return iter(tree, 0);
};

export default stylish;
