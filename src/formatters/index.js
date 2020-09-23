import stylish from './stylish.js';
import plain from './plain.js';

const getFormater = (type) => {
  if (type === 'plain') {
    return plain;
  }

  return stylish;
};

export default getFormater;
