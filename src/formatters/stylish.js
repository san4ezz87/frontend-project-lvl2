// import hasObjectKey from '../../utils/hasObjectKey.js';
import _ from 'lodash/index.js';

const signsMap = {
  deleted: '- ',
  added: '+ ',
  unchanged: '  ',
  undefined: '  ',
  incomparable: '  ',
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
const buildValue = (value, indention, indentionCount) => (_.isPlainObject(value) ? `{\n${stringify(value, '  ', indentionCount + 2)}\n  ${indention}}` : value);
const render = (key, value) => `${key}: ${value}`;

const stylish = (tree) => {
  const iter = (treeIn, indentionCountUp) => {
    const indentionUp = '  '.repeat(indentionCountUp);

    const statesHandlers = {
      deleted: (node, signsList, indention, indentionCount) => {
        const sign = signsList[node.state];
        const value = buildValue(node.valueOld, indention, indentionCount);
        const key = buildkey(indention, sign, node.name);
        return render(key, value);
      },
      added: (node, signsList, indention, indentionCount) => {
        const sign = signsList[node.state];
        const value = buildValue(node.valueNew, indention, indentionCount);
        const key = buildkey(indention, sign, node.name);
        return render(key, value);
      },
      changed: (node, signsList, indention, indentionCount) => {
        const valueNew = buildValue(node.valueNew, indention, indentionCount);
        const valueOld = buildValue(node.valueOld, indention, indentionCount);

        const changed = [];
        const keyOld = buildkey(indention, signsList.deleted, node.name);
        const keyNew = buildkey(indention, signsList.added, node.name);

        changed.push(render(keyOld, valueOld));
        changed.push(render(keyNew, valueNew));
        return changed.join('\n');
      },
      unchanged: (node, signsList, indention, indentionCount) => {
        const sign = signsList[node.state];
        const value = buildValue(node.valueOld, indention, indentionCount);
        const key = buildkey(indention, sign, node.name);
        return render(key, value);
      },
      incomparable: (node, signsList, indention, indentionCount) => {
        const sign = signsList[node.state];
        const value = _.has(node, 'children') ? `{\n${iter(node.children, indentionCount + 2)}\n  ${indention}}` : node.valueOld;
        const key = buildkey(indention, sign, node.name);
        return render(key, value);
      },
    };

    const stateHandler = (state) => {
      const defaultHandler = (node, signsList, indention) => {
        const sign = signsList[node.state];
        const key = buildkey(indention, sign, node.name);
        return render(key, node.value);
      };
      return typeof statesHandlers[state] === 'function' ? statesHandlers[state] : defaultHandler;
    };

    const res = treeIn.map((node) => stateHandler(node.state)(node, signsMap, indentionUp, indentionCountUp)).join('\n');
    return res;
  };

  const result = iter(tree, 1);
  return `{\n${result}\n}`;
};

export default stylish;
