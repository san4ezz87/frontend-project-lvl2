import genDiff from '../src/gendiff.js';
import { readFile } from '../utils/utils.js';
import getFixturePath from '../utils/getFixturePath.js';

test.each([
  ['ini'],
  ['yml'],
])('different formats of files, ini, yml with stylish formatter', (extansion) => {
  const pathOne = getFixturePath(`file1.${extansion}`);
  const pathTwo = getFixturePath(`file2.${extansion}`);

  const expected = readFile(getFixturePath('resultPlainStylish.txt'));

  expect(genDiff(pathOne, pathTwo, '')).toBe(expected);
});

test.each([
  ['defaul', 'resultNestedStylish.txt'],
  ['plain', 'resultNestedPlain.txt'],
  ['json', 'resultNestedJson.json'],
])('compare two recursive obj with %s formater', (formaterType, fixtureFile) => {
  const pathOne = getFixturePath('fileOneNested.json');
  const pathTwo = getFixturePath('fileTwoNested.json');

  const expected = readFile(getFixturePath(fixtureFile));
  expect(genDiff(pathOne, pathTwo, formaterType)).toBe(expected);
});
