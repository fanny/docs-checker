const path = require('path');
const fs = require('fs');
const { mergeWith } = require('lodash');

const CONFIG_FILENAME = 'config.json';
const RULES_DIR = 'rules';

function mergeCustomizer(objValue, srcValue) {
  if (
    Object.prototype.toString.call(objValue) === '[object Object]' &&
    Object.keys(objValue).length !== Object.keys(srcValue).length
  ) {
    return srcValue;
  }
}

function loadRuleConfigs(userRulesConfig) {
  const sourceConfig = require(path.resolve(
    __dirname,
    `../src/${CONFIG_FILENAME}`,
  ));

  const rulesConfig = mergeWith(
    sourceConfig.rules,
    userRulesConfig,
    mergeCustomizer,
  );
  return rulesConfig;
}

function loadRules(userRulesDir) {
  const defaultRules = require(path.resolve(__dirname, `../src/${RULES_DIR}`));
  const customRules = userRulesDir && require(path.resolve(userRulesDir));

  return customRules !== null
    ? [...defaultRules, ...customRules]
    : [...defaultRules];
}

function loadConfigFileInAncestors(directoryPath, rootPath) {
  const configPath = path.join(directoryPath, CONFIG_FILENAME);
  const parentPath = path.dirname(directoryPath);

  if (fs.existsSync(configPath)) {
    return path.resolve(configPath);
  } else {
    if (parentPath === rootPath) {
      throw `Cannot read config file: ${CONFIG_FILENAME}\n`;
    } else {
      return loadConfigFileInAncestors(parentPath);
    }
  }
}

function loadOptions(files, projectDir = process.cwd()) {
  const [filePath, _] = files;
  const docsPath = path.join(projectDir, path.dirname(filePath));
  const configFile = loadConfigFileInAncestors(docsPath, projectDir);

  const { rules: userRulesConfig } = require(configFile);
  const userRulesDir =
    userRulesConfig.customRules &&
    path.join(docsPath, userRulesConfig.customRules);

  const rulesConfig = loadRuleConfigs(userRulesConfig);
  const rules = loadRules(userRulesDir);

  return {
    files,
    config: rulesConfig,
    customRules: rules,
  };
}

// supress lint https://github.com/rome/tools/blob/5c6e97043ad4d515d8a79a877c4641a95ca4867a/internal/compiler/suppressionsParser.ts#L265
module.exports = {
  loadOptions,
};
