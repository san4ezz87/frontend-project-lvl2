import genDiff from '../src/gendiff.js';
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
