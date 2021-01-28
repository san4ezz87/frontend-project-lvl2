import stylish from './stylish.js';
import plain from './plain.js';

const formaters = {
  plain,
  json: (tree) => JSON.stringify(tree, null, 2),
  stylish,
};

const getFormater = (format = 'stylish') => {
  const formater = formaters[format];

  return formater || new Error('не верное имя форматера');
};

export default getFormater;
