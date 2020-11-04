import yaml from 'js-yaml';
import { parseIni } from '../utils/utils.js';

const parse = (data, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(data);

    case 'yml':
      return yaml.safeLoad(data);

    case 'ini':
      return parseIni(data);

    default:
      return {};
  }
};

export default parse;
