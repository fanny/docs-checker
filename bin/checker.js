const cli = require('commander');
const {loadOptions} = require('./loaders.js');
const {lint} = require('../src/commands/lint.js');

cli
  .command('lint <yourfile...>')
  .description('Run checks in the specified files or globs')
  .action((files) => {
    const options = loadOptions(files);
    lint(options);
  });

cli.parse(process.argv);
