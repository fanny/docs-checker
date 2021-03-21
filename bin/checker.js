#!/usr/bin/env node

const cli = require('commander');
const { loadOptions } = require('./loaders.js');
const { lint } = require('../src/commands/lint.js');

// TODO: https://github.com/rome/tools/blob/main/internal/resources/index.ts
// process exit

cli
  .command('run <dir|glob|files...>')
  .description('Run checks in the specified files or globs')
  .action((files) => {
    console.log(files);
    const options = loadOptions(files);
    lint(options);
  });

cli.parse(process.argv);
