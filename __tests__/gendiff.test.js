import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['json', 'ini', 'yml'];

const resultStylish = readFile('result_stylish.txt');
const resultPlain = readFile('result_plain.txt');
const resultJson = readFile('result_json.json');

test.each(formats)('different formats of files %s', (format) => {
  const filePath1 = getFixturePath(`file1.${format}`);
  const filePath2 = getFixturePath(`file2.${format}`);

  expect(genDiff(filePath1, filePath2)).toBe(resultStylish);
  expect(genDiff(filePath1, filePath2, 'stylish')).toBe(resultStylish);
  expect(genDiff(filePath1, filePath2, 'plain')).toBe(resultPlain);
  expect(genDiff(filePath1, filePath2, 'json')).toBe(resultJson);
});
