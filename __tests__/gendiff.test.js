import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import genDiff from '../src/gendiff.js';
import {
  readFile,
} from '../utils/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const formats = ['json', 'ini', 'yml'];

const resultStylish = readFile(getFixturePath('resultStylish.txt'));
const resultPlain = readFile(getFixturePath('resultPlain.txt'));
const resultJson = readFile(getFixturePath('result.json'));

test.each(formats)('different formats of files %s', (format) => {
  const pathOne = getFixturePath(`file1.${format}`);
  const pathTwo = getFixturePath(`file2.${format}`);

  expect(genDiff(pathOne, pathTwo)).toBe(resultStylish);
  expect(genDiff(pathOne, pathTwo, 'plain')).toBe(resultPlain);
  expect(genDiff(pathOne, pathTwo, 'json')).toBe(resultJson);
});
