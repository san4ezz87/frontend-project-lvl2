import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const getFormater = (type) => {
  if (type === 'plain') {
    return plain;
  }

  if (type === 'json') {
    return json;
  }

  return stylish;
};

export default getFormater;
