import genDiff from '../src/gendiff.js';
import buildAST from '../src/buildAST.js';
import readFile from '../utils/readFile.js';
import getFixturePath from '../utils/getFixturePath.js';

const result = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test.each([
  ['ini', result],
  ['yml', result],
])('different formats of files, ini, yml with stylish formatter', (extansion, expected) => {
  const pathOne = getFixturePath(`file1.${extansion}`);
  const pathTwo = getFixturePath(`file2.${extansion}`);

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
  expect(genDiff(pathOne, pathTwo, formaterType)).toBe(expected.data);
});

test('Build AST', () => {
  const exemple = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    some: {
      alex: 'smirnov',
    },
    follow: false,
    new: [1, 3, { a: 0 }],
  };

  const res = {
    follow: { name: 'follow', type: 'Boolean', value: false },
    host: { name: 'host', type: 'String', value: 'hexlet.io' },
    new: {
      name: 'new',
      type: 'Array',
      value: [1, 3, { a: 0 }],
    },
    proxy: { name: 'proxy', type: 'String', value: '123.234.53.22' },
    some: {
      name: 'some',
      type: 'Object',
      value: {
        alex: { name: 'alex', type: 'String', value: 'smirnov' },
      },
    },
    timeout: { name: 'timeout', type: 'Number', value: 50 },
  };

  expect(buildAST(exemple)).toMatchObject(res);
});
