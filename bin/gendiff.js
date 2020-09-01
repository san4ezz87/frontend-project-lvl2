#!/usr/bin/env node

import commander from 'commander';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff.js';

function readFile(pathString) {
  const compoosedPath = path.resolve(process.cwd(), pathString);
  const fileUrl = new URL(`file://${compoosedPath}`);
  let file;
  try {
    file = fs.readFileSync(fileUrl, 'utf8');
  } catch (e) {
    process.stdout.write('cant read file');
    return '{}';
  }
  return file;
}

const program = new commander.Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
  .description('Usage: gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((smth, env) => {
    const files = env.map((file) => readFile(file));

    const [first, second] = files;
    const result = genDiff(first, second);
    process.stdout.write(result);
  });

program.parse(process.argv);
