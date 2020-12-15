#!/usr/bin/env node

import commander from 'commander';

import genDiff from '../src/gendiff.js';

const program = new commander.Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
  .arguments('<filePath1> <filePath2>')
  .description('Usage: gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filePath1, filePath2) => {
    const result = genDiff(filePath1, filePath2, program.format);
    console.log(result);
  });

program.parse(process.argv);
