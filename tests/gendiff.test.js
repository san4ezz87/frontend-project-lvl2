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
  ['file1.ini', 'file2.ini', result],
  ['file1.yml', 'file2.yml', result],
])('different formats of files, ini, yml with stylish formatter', (file1, file2, expected) => {
  const file1Res = readFile(file1);
  const file2Res = readFile(file2);
  expect(genDiff(file1Res, file2Res, getFormater())).toBe(expected);
});

test('compare two recursive obj with plain formater', () => {
  const file1 = readFile('fileOneNested.json');
  const file2 = readFile('fileTwoNested.json');
  const expected = readFile('resultNestedPlain.txt');
  expect(genDiff(file1, file2, getFormater('plain'))).toBe(expected.data);
});

test('compare two recursive obj with stylish formatter', () => {
  const file1 = readFile('fileOneNested.json');
  const file2 = readFile('fileTwoNested.json');
  const expected = readFile('resultNestedStylish.txt');
  expect(genDiff(file1, file2, getFormater())).toBe(expected.data);
});

test('compare two recursive obj with JSON formatter', () => {
  const file1 = readFile('fileOneNested.json');
  const file2 = readFile('fileTwoNested.json');
  const expected = readFile('resultNestedJson.json');
  expect(genDiff(file1, file2, getFormater('json'))).toBe(expected.data);
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
