import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash/index.js';

const numberifyValues = (obj) => _.mapValues(obj, (value) => {
  if (_.isObjectLike(value)) {
    return numberifyValues(value);
  }
  const parsed = parseFloat(value);
  return _.isNaN(parsed) ? value : parsed;
});

const parseIni = (data) => numberifyValues(ini.parse(data));

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
