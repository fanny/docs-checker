const path = require('path');
const {Moenda} = require(path.resolve(
  __dirname,
  '../node_modules/Moenda/Moenda',
))
const { formatter } = require('../bin/formatter.js');

function run(options) {
  const moenda = new Moenda({
    parser: 'md',
    rules: options.customRules,
    files: options.files,
    processor: require(path.resolve(__dirname, './parser')).createContext,
    rulesConfig: options.config,
  });

  moenda.runRules();
  console.log(formatter(moenda.getResults()));
}

module.exports = {
  run,
};
