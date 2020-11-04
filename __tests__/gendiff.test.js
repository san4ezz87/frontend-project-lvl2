import genDiff from '../src/gendiff.js';
import { readFile } from '../utils/utils.js';
import getFixturePath from '../utils/getFixturePath.js';

const formats = ['ini', 'yml'];

test.each(formats)('different formats of files %s with stylish formatter', (format) => {
  const pathOne = getFixturePath(`file1.${format}`);
  const pathTwo = getFixturePath(`file2.${format}`);

  const expected = readFile(getFixturePath('resultPlainStylish.txt'));

  expect(genDiff(pathOne, pathTwo, '')).toBe(expected);
});

const formatersTypes = [
  ['defaul', 'resultNestedStylish.txt'],
  ['plain', 'resultNestedPlain.txt'],
  ['json', 'resultNestedJson.json'],
];

test.each(formatersTypes)('compare two recursive obj with %s formater', (formaterType, fixtureFile) => {
  const pathOne = getFixturePath('fileOneNested.json');
  const pathTwo = getFixturePath('fileTwoNested.json');

  const expected = readFile(getFixturePath(fixtureFile));
  expect(genDiff(pathOne, pathTwo, formaterType)).toBe(expected);
});
