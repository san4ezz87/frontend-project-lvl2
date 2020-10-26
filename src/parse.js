import yaml from 'js-yaml';
import ini from 'ini';

const parse = (data, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(data);

    case 'yml':
      return yaml.safeLoad(data);

    case 'ini':
      return ini.parse(data);

    default:
      return {};
  }
};

export default parse;
