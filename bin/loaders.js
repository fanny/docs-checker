const path = require('path');
const fs = require('fs');
const { merge } = require('lodash');

const CONFIG_FILENAME = 'config.json';
const RULES_DIR = 'rules';

function loadRuleConfigs(userRulesConfig) {
  const sourceConfig = require(path.resolve(
    __dirname,
    `../src/${CONFIG_FILENAME}`,
  ));

  const rules = merge(userRulesConfig, sourceConfig);
  return rules;
}

function loadRules(userRulesDir) {
  const defaultRules = require(path.resolve(
    __dirname,
    `../src/${RULES_DIR}`,
  ));
  const customRules = userRulesDir && require(
    path.resolve(userRulesDir)
  );
  
  return (customRules !== null) 
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

// TODO: Add validations
function loadOptions(files, projectDir = process.cwd()) {
  const [filePath, _] = files;
  const docsPath = path.join(projectDir, path.dirname(filePath)) 
  const configFile = loadConfigFileInAncestors(docsPath, projectDir);

  const { rules: userRulesConfig } = require(configFile);
  const userRulesDir = userRulesConfig.customRules && 
    path.join(docsPath, userRulesConfig.customRules);

  const rulesConfig = loadRuleConfigs(userRulesConfig);
  const rules = loadRules(userRulesDir);

  return {
    files,
    config: rulesConfig,
    customRules: rules,
  };
}

// normalizeConfigs: https://github.com/rome/tools/blob/main/internal/core/common/userConfig.ts
// check if configs exist on file
module.exports = {
  loadOptions,
};
