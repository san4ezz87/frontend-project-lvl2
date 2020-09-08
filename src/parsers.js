import yaml from 'js-yaml';

const parse = (file) => {
  if (file.ext === '.json') {
    return JSON.parse(file.data);
  }

  if (file.ext === '.yml') {
    return yaml.safeLoad(file.data);
  }

  return {};
};

export default parse;
