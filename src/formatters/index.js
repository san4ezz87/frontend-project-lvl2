import stylish from './stylish.js';
import plain from './plain.js';

const formaters = {
  plain,
  json: JSON.stringify,
  stylish,
};

const format = (formatType = 'stylish', ast) => {
  const formater = formaters[formatType];
  if (formater) {
    return formater(ast);
  }

  throw new Error('не верное имя форматера');
};

export default format;
