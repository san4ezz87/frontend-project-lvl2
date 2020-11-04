import genDiff from '../src/gendiff.js';
import { readFile } from '../utils/utils.js';
import getFixturePath from '../utils/getFixturePath.js';

const formats = ['ini', 'yml'];

test.each(formats)('different formats of files %s with stylish formatter', (format) => {
  const pathOne = getFixturePath(`file1.${format}`);
  const pathTwo = getFixturePath(`file2.${format}`);

  const resultStylish = readFile(getFixturePath('resultStylish.txt'));
  const resultPlain = readFile(getFixturePath('resultPlain.txt'));
  const resultJson = readFile(getFixturePath('result.json'));

  expect(genDiff(pathOne, pathTwo, '')).toBe(resultStylish);
  expect(genDiff(pathOne, pathTwo, 'plain')).toBe(resultPlain);
  expect(genDiff(pathOne, pathTwo, 'json')).toBe(resultJson);
});
