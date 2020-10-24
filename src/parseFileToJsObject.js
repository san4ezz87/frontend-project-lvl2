import yaml from 'js-yaml';
import ini from 'ini';

const parseFileToJsObject = (file) => {
  switch (file.ext) {
    case '.json':
      return JSON.parse(file.data);

    case '.yml':
      return yaml.safeLoad(file.data);

    case '.ini':
      return ini.parse(file.data);

    default:
      return {};
  }
};

export default parseFileToJsObject;
