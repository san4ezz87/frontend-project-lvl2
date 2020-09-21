#!/usr/bin/env node

import commander from 'commander';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff.js';
import stylish from '../src/formaters.js';

function readFile(pathString) {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  const fileUrl = new URL(`file://${compoosedPath}`);
  let data;
  const ext = path.extname(pathString);

  try {
    data = fs.readFileSync(fileUrl, 'utf8');
  } catch (e) {
    process.stdout.write('cant read file', e);
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
    const formatersList = {
      stylish,
    };

    const formater = formatersList[program.format];
    const [first, second] = files;
    const result = genDiff(first, second, formater);
    process.stdout.write(result);
  });

program.parse(process.argv);
