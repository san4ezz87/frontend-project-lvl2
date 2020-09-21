import genDiff from '../src/gendiff.js';
import {
  parser,
  buildAST,
} from '../src/parsers';
import { readFile } from './getFixturePath.js';
import stylish from '../src/formaters.js';

const recursiveResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}`;

test.each([
  ['file1Big.json', 'file2Big.json', recursiveResult],
])('compare two recursive obj', (first, second, expected) => {
  const file1 = readFile(first);
  const file2 = readFile(second);
  expect(genDiff(file1, file2, stylish)).toBe(expected);
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

test('Build Diff AST', () => {
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

  const res = {
    follow: {
      name: 'follow',
      type: 'Boolean',
      value: false,
      status: 'notChanged',
    },
    host: {
      name: 'host',
      type: 'String',
      value: 'hexlet.io',
      status: 'notChanged',
    },
    new: {
      name: 'new',
      type: 'Array',
      value: [1, 3, { a: 0 }],
      status: 'notChanged',
    },
    proxy: {
      name: 'proxy',
      type: 'String',
      value: '123.234.53.22.11',
      status: 'deleted',
    },
    proxyd: {
      name: 'proxy',
      type: 'String',
      value: '123.234.53.22',
      status: 'added',
    },
    some: {
      name: 'some',
      type: 'Object',
      value: {
        alex: {
          name: 'alex',
          type: 'String',
          value: 'smirnov',
          status: 'notChanged',
        },
      },
      status: 'notChanged',
    },
    timeout: {
      name: 'timeout',
      type: 'Number',
      value: 50,
      status: 'deleted',
    },
    timeoutd: {
      name: 'timeout',
      type: 'String',
      value: 'aa',
      status: 'added',
    },
  };
  expect(res).toMatchObject(parser(exemple, exemple2));
});
