#!/usr/bin/env node

import commander from 'commander';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff.js';
import getFormater from '../src/formatters/index.js';

function readFile(pathString) {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  const fileUrl = new URL(`file://${compoosedPath}`);
  let data;
  const ext = path.extname(pathString);

  try {
    data = fs.readFileSync(fileUrl, 'utf8');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('cant read file', e);
    return {
      ext,
      data: '{}',
    };
  }
  return {
    ext,
    data,
  };
}

const program = new commander.Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
  .description('Usage: gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((smth, env) => {
    const files = env.map((file) => readFile(file));
    const [first, second] = files;

    const formater = getFormater(program.format);

    const result = genDiff(first, second, formater);
    // eslint-disable-next-line no-console
    console.log(result);
  });

program.parse(process.argv);
