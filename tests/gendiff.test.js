import genDiff from '../src/gendiff.js';
import {
  buildAST,
} from '../src/parsers';
import { readFile } from './getFixturePath.js';
import getFormater from '../src/formatters/index.js';

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
  const file1Res = readFile(`file1.${extansion}`);
  const file2Res = readFile(`file2.${extansion}`);
  expect(genDiff(file1Res, file2Res, getFormater())).toBe(expected);
});

test.each([
  ['defaul', 'resultNestedStylish.txt'],
  ['plain', 'resultNestedPlain.txt'],
  ['json', 'resultNestedJson.json'],
])('compare two recursive obj with %s formater', (formaterType, fixtureFile) => {
  const file1 = readFile('fileOneNested.json');
  const file2 = readFile('fileTwoNested.json');
  const expected = readFile(fixtureFile);
  expect(genDiff(file1, file2, getFormater(formaterType))).toBe(expected.data);
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
