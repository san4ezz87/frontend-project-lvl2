import yaml from 'js-yaml';
import ini from 'ini';

const parse = (data) => {
  switch (data.type) {
    case '.json':
      return JSON.parse(data.value);

    case '.yml':
      return yaml.safeLoad(data.value);

    case '.ini':
      return ini.parse(data.value);

    default:
      return {};
  }
};

export default parse;
