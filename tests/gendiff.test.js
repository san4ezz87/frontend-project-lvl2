import genDiff from '../src/gendiff.js';
import {
  parser,
  buildAST,
} from '../src/parsers';
import { readFile } from './getFixturePath.js';

test.each([
  ['file1.json', 'file2.json', '{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}'],
  ['file1.yml', 'file2.yml', '{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}'],
  ['file1.ini', 'file2.ini', '{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}'],
])('comparet two obj ', (first, second, expected) => {
  const file1 = readFile(first);
  const file2 = readFile(second);

  expect(genDiff(file1, file2)).toBe(expected);
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

test('Build Diff', () => {
  const exemple = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22.11',
    some: {
      alex: 'smirnov',
    },
    follow: false,
    new: [1, 3, { a: 0 }],
  };

  const exemple2 = {
    host: 'hexlet.io',
    timeout: 'aa',
    proxy: '123.234.53.22',
    some: {
      alex: 'smirnov',
    },
    follow: false,
    new: [1, 3, { a: 0 }],
  };

  const res = [
    {
      name: 'follow',
      type: 'Boolean',
      value: false,
      status: 'notChanged',
    },
    {
      name: 'host',
      type: 'String',
      value: 'hexlet.io',
      status: 'notChanged',
    }, {
      name: 'new',
      type: 'Array',
      value: [1, 3, { a: 0 }],
      status: 'notChanged',
    },
    {
      name: 'proxy',
      type: 'String',
      value: '123.234.53.22.11',
      status: 'deleted',
    },
    {
      name: 'proxy',
      type: 'String',
      value: '123.234.53.22',
      status: 'added',
    },
    {
      name: 'some',
      type: 'Object',
      value: [{
        name: 'alex',
        type: 'String',
        value: 'smirnov',
        status: 'notChanged',
      }],
      status: 'notChanged',
    },
    {
      name: 'timeout',
      type: 'Number',
      value: 50,
      status: 'deleted',
    },
    {
      name: 'timeout',
      type: 'String',
      value: 'aa',
      status: 'added',
    }];
  expect(res).toMatchObject(parser(exemple, exemple2));
});
