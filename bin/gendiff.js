#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
program.version('0.0.1', '-v, --vers', 'output the current version')
.description('Usage: gendiff [options]')
.description('Compares two configuration files and shows a difference.')
.option('-f, --format [type]', 'output format')

program.parse(process.argv);
