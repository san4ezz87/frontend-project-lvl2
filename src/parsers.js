import yaml from 'js-yaml';
import ini from 'ini';

const parse = (file) => {
  if (file.ext === '.json') {
    return JSON.parse(file.data);
  }

  if (file.ext === '.yml') {
    return yaml.safeLoad(file.data);
  }

  if (file.ext === '.ini') {
    return ini.parse(file.data);
  }

  return {};
};

export default parse;
