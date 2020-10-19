import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formaters = {
  plain,
  json,
  stylish,
  default: stylish,
};

const getFormater = (type) => {
  const formater = formaters[type];

  return formater || stylish;
};

export default getFormater;
