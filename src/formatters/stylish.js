import _ from 'lodash';

const indent = (depthLevel, count = 4) => ' '.repeat(depthLevel * count - 2);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }
  const nodeEntries = Object.entries(value);
  const indention = indent(depth + 1);

  const result = nodeEntries.map(([key, content]) => {
    const handledContent = `${stringify(content, depth + 1)}`;
    return `${indention}  ${key}: ${handledContent}`;
  });

  return `{\n${result.join('\n')}\n${indent(depth)}  }`;
};

const stylish = (tree) => {
  const iter = (node, depth) => {
    switch (node.type) {
      case 'root': {
        return `{\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n}`;
      }
      case 'deleted': {
        const indention = indent(depth);
        const value = stringify(node.value, depth);
        return `${indention}- ${node.key}: ${value}`;
      }
      case 'added': {
        const indention = indent(depth);
        const value = stringify(node.value, depth);
        return `${indention}+ ${node.key}: ${value}`;
      }
      case 'changed': {
        const indention = indent(depth);
        const valueNew = stringify(node.valueNew, depth);
        const valueOld = stringify(node.valueOld, depth);
        const stringNew = `${indention}- ${node.key}: ${valueOld}`;
        const stringOld = `${indention}+ ${node.key}: ${valueNew}`;
        return `${stringNew}\n${stringOld}`;
      }
      case 'unchanged': {
        const indention = indent(depth);
        const value = stringify(node.value, depth);
        return `${indention}  ${node.key}: ${value}`;
      }
      case 'nested': {
        const indention = indent(depth);
        const value = `{\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n${indention}  }`;
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
