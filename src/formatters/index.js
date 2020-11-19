import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formaters = {
  plain,
  json,
  stylish,
};

const getFormater = (format = 'stylish') => {
  const formater = formaters[format];

  return formater || new Error('не верное имя форматера');
};

export default getFormater;
