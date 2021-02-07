import _ from 'lodash';

const indent = (depthLevel, count = 4) => ' '.repeat(depthLevel * count - 2);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const result = Object.entries(value).map(([key, content]) => {
    const handledContent = `${stringify(content, depth + 1)}`;
    return `${indent(depth + 1)}  ${key}: ${handledContent}`;
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
        const value = stringify(node.value, depth);
        return `${indent(depth)}- ${node.key}: ${value}`;
      }
      case 'added': {
        const value = stringify(node.value, depth);
        return `${indent(depth)}+ ${node.key}: ${value}`;
      }
      case 'changed': {
        const valueNew = stringify(node.valueNew, depth);
        const valueOld = stringify(node.valueOld, depth);
        const stringNew = `${indent(depth)}- ${node.key}: ${valueOld}`;
        const stringOld = `${indent(depth)}+ ${node.key}: ${valueNew}`;
        return `${stringNew}\n${stringOld}`;
      }
      case 'unchanged': {
        const value = stringify(node.value, depth);
        return `${indent(depth)}  ${node.key}: ${value}`;
      }
      case 'nested': {
        const value = `{\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n${indent(depth)}  }`;
        return `${indent(depth)}  ${node.key}: ${value}`;
      }
      default: {
        throw new Error(`Unknown node type ${node.type}`);
      }
    }
  };
  return iter(tree, 0);
};

export default stylish;
