import stylish from './stylish.js';
import plain from './plain.js';

const formaters = {
  plain,
  json: (tree) => JSON.stringify(tree),
  stylish,
};

const formate = (format = 'stylish', ast) => {
  const formater = formaters[format];

  return (formater && formater(ast)) || new Error('не верное имя форматера');
};

export default formate;
