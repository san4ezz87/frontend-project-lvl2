#!/usr/bin/env node

import commander from 'commander';

import genDiff from '../src/gendiff.js';

const program = new commander.Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
  .arguments('<pathOne> <pathTwo>')
  .description('Usage: gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((pathOne, pathTwo) => {
    const formater = program.format;

    const result = genDiff(pathOne, pathTwo, formater);
    console.log(result);
  });

program.parse(process.argv);
