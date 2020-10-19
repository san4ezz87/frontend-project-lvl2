#!/usr/bin/env node

import commander from 'commander';

import genDiff from '../src/gendiff.js';

const program = new commander.Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
  .description('Usage: gendiff [options]')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((smth, env) => {
    const [first, second] = env;
    const formater = program.format;

    const result = genDiff(first, second, formater);
    // eslint-disable-next-line no-console
    console.log(result);
  });

program.parse(process.argv);
