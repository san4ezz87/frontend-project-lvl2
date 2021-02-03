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
const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: parseIni,
};

const parse = (data, format) => {
  const parser = parsers[format];
  return (parser && parser(data)) || new Error('не верный формат файла');
};

export default parse;
