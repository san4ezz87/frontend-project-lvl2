import genDiff from '../src/gendiff.js';
import {
  buildAST,
} from '../src/parsers';
import { readFile } from './getFixturePath.js';
import getFormater from '../src/formatters/index.js';

const plainResult = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to [complex value]
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From 'too much' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

test.each([
  ['file1Big.json', 'file2Big.json', plainResult],
])('compare two recursive obj in plain formater', (first, second, expected) => {
  const file1 = readFile(first);
  const file2 = readFile(second);
  expect(genDiff(file1, file2, getFormater('plain'))).toBe(expected);
});

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
  expect(genDiff(file1, file2, getFormater())).toBe(expected);
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

const recursiveResultJson = `{
  "common": {
    "name": "common",
    "typeOld": "Object",
    "typeNew": null,
    "valueOld": {
      "follow": {
        "name": "follow",
        "typeOld": null,
        "typeNew": "Boolean",
        "valueOld": null,
        "valueNew": false,
        "status": "added",
        "parent": [
          "common"
        ]
      },
      "setting1": {
        "name": "setting1",
        "typeOld": "String",
        "typeNew": null,
        "valueOld": "Value 1",
        "valueNew": null,
        "status": "notChanged",
        "parent": [
          "common"
        ]
      },
      "setting2": {
        "name": "setting2",
        "typeOld": "Number",
        "typeNew": null,
        "valueOld": 200,
        "valueNew": null,
        "status": "deleted",
        "parent": [
          "common"
        ]
      },
      "setting3": {
        "name": "setting3",
        "typeOld": "Boolean",
        "typeNew": "Object",
        "valueOld": true,
        "valueNew": {
          "key": {
            "name": "key",
            "type": "String",
            "value": "value"
          }
        },
        "status": "changed",
        "parent": [
          "common"
        ]
      },
      "setting4": {
        "name": "setting4",
        "typeOld": null,
        "typeNew": "String",
        "valueOld": null,
        "valueNew": "blah blah",
        "status": "added",
        "parent": [
          "common"
        ]
      },
      "setting5": {
        "name": "setting5",
        "typeOld": null,
        "typeNew": "Object",
        "valueOld": null,
        "valueNew": {
          "key5": {
            "name": "key5",
            "type": "String",
            "value": "value5"
          }
        },
        "status": "added",
        "parent": [
          "common"
        ]
      },
      "setting6": {
        "name": "setting6",
        "typeOld": "Object",
        "typeNew": null,
        "valueOld": {
          "doge": {
            "name": "doge",
            "typeOld": "Object",
            "typeNew": null,
            "valueOld": {
              "wow": {
                "name": "wow",
                "typeOld": "String",
                "typeNew": "String",
                "valueOld": "too much",
                "valueNew": "so much",
                "status": "changed",
                "parent": [
                  "common",
                  "setting6",
                  "doge"
                ]
              }
            },
            "valueNew": null,
            "status": "notChanged",
            "parent": [
              "common",
              "setting6"
            ]
          },
          "key": {
            "name": "key",
            "typeOld": "String",
            "typeNew": null,
            "valueOld": "value",
            "valueNew": null,
            "status": "notChanged",
            "parent": [
              "common",
              "setting6"
            ]
          },
          "ops": {
            "name": "ops",
            "typeOld": null,
            "typeNew": "String",
            "valueOld": null,
            "valueNew": "vops",
            "status": "added",
            "parent": [
              "common",
              "setting6"
            ]
          }
        },
        "valueNew": null,
        "status": "notChanged",
        "parent": [
          "common"
        ]
      }
    },
    "valueNew": null,
    "status": "notChanged",
    "parent": []
  },
  "group1": {
    "name": "group1",
    "typeOld": "Object",
    "typeNew": null,
    "valueOld": {
      "baz": {
        "name": "baz",
        "typeOld": "String",
        "typeNew": "String",
        "valueOld": "bas",
        "valueNew": "bars",
        "status": "changed",
        "parent": [
          "group1"
        ]
      },
      "foo": {
        "name": "foo",
        "typeOld": "String",
        "typeNew": null,
        "valueOld": "bar",
        "valueNew": null,
        "status": "notChanged",
        "parent": [
          "group1"
        ]
      },
      "nest": {
        "name": "nest",
        "typeOld": "Object",
        "typeNew": "String",
        "valueOld": {
          "key": {
            "name": "key",
            "type": "String",
            "value": "value"
          }
        },
        "valueNew": "str",
        "status": "changed",
        "parent": [
          "group1"
        ]
      }
    },
    "valueNew": null,
    "status": "notChanged",
    "parent": []
  },
  "group2": {
    "name": "group2",
    "typeOld": "Object",
    "typeNew": null,
    "valueOld": {
      "abc": {
        "name": "abc",
        "type": "Number",
        "value": 12345
      },
      "deep": {
        "name": "deep",
        "type": "Object",
        "value": {
          "id": {
            "name": "id",
            "type": "Number",
            "value": 45
          }
        }
      }
    },
    "valueNew": null,
    "status": "deleted",
    "parent": []
  },
  "group3": {
    "name": "group3",
    "typeOld": null,
    "typeNew": "Object",
    "valueOld": null,
    "valueNew": {
      "fee": {
        "name": "fee",
        "type": "Number",
        "value": 100500
      },
      "deep": {
        "name": "deep",
        "type": "Object",
        "value": {
          "id": {
            "name": "id",
            "type": "Object",
            "value": {
              "number": {
                "name": "number",
                "type": "Number",
                "value": 45
              }
            }
          }
        }
      }
    },
    "status": "added",
    "parent": []
  }
}`;
test.each([
  ['file1Big.json', 'file2Big.json', recursiveResultJson],
])('compare two recursive obj in JSON format', (first, second, expected) => {
  const file1 = readFile(first);
  const file2 = readFile(second);
  expect(genDiff(file1, file2, getFormater('json'))).toBe(expected);
});
