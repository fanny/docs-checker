#!/usr/bin/env node

const cli = require('commander');
const { loadOptions } = require('./loaders.js');
const { run } = require('../src/run.js');

// TODO: https://github.com/rome/tools/blob/main/internal/resources/index.ts
// process exit

cli
  .command('run <dir|glob|files...>')
  .description('Run checks in the specified files or globs')
  .action((files) => {
    const options = loadOptions(files);
    run(options);
  });

cli.parse(process.argv);
