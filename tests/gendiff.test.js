import genDiff from '../src/gendiff.js';
import { readFile } from './getFixturePath.js';

test('comparet two obj JSON', async () => {
  const file1 = await readFile('file1.json');
  const file2 = await readFile('file2.json');
  expect(genDiff(file1, file2)).toBe('{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}');
});

test('comparet two obj  YAML', () => {
  const file1 = readFile('file1.yml');
  const file2 = readFile('file2.yml');
  expect(genDiff(file1, file2)).toBe('{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}');
});
