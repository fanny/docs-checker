#!/usr/bin/env node

const cli = require('commander');
const { loadOptions } = require('../src/loaders.js');
const { run } = require('../src/run.js');

cli
  .command('run <dir|glob|files...>')
  .description('Run checks in the specified files or globs')
  .action((files) => {
    const options = loadOptions(files);
    run(options);
  });

cli.parse(process.argv);
