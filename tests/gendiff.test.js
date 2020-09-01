import genDiff from '../src/gendiff.js';
import { readFilePromise } from './getFixturePath.js';

test('comparet two obj', async () => {
  const file1 = await readFilePromise('file1.json');
  const file2 = await readFilePromise('file2.json');
  expect(genDiff(file1, file2)).toBe('{\n- follow: false\n host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}');
});
