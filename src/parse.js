import yaml from 'js-yaml';
import { parseIni } from '../utils/utils.js';

const parse = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);

    case 'yml':
      return yaml.safeLoad(data);

    case 'ini':
      return parseIni(data);

    default:
      throw new Error('не верынй формат файла');
  }
};

export default parse;
