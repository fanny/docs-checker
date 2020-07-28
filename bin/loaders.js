const path = require('path');
const fs = require('fs');

const CONFIG_FILENAME = 'config.json';
const RULES_DIR = 'rules';

function mergeRuleConfigs(target, source) {
  const entries = Object.entries(source);
  entries.forEach((entry) => {
    const [rule, sourceDef] = entry;
    const targetDef = target[rule];
    if (!targetDef) {
      if (Array.isArray(source[rule])) {
        // TO DO: evaluate a better strategy for deep structures
        target[rule] = [...sourceDef];
      } else {
        target[rule] = sourceDef;
      }
    }
  });
  return target;
}

function loadRuleConfigs(userRulesConfig) {
  const sourceConfig = require(path.resolve(
    __dirname,
    `../src/${CONFIG_FILENAME}`,
  ));
  const rules = mergeRuleConfigs(userRulesConfig, sourceConfig);
  return rules;
}

function loadRules() {
  const defaultRulesDir = require(path.resolve(
    __dirname,
    `../src/${RULES_DIR}`,
  ));

  return [...defaultRulesDir];
}


function loadConfigFileInAncestors(directoryPath, rootPath){
  const configPath = path.join(directoryPath, CONFIG_FILENAME);
  const parentPath = path.dirname(directoryPath);

  if(fs.existsSync(configPath)){
    return path.resolve(configPath);
  } else {
    if(parentPath === rootPath){
      throw `Cannot read config file: ${CONFIG_FILENAME}\n`
    } else {
      return loadConfigFileInAncestors(parentPath);
    }
  }
}


function loadConfigFile(projectDir, files) {
  const localConfigPath = path.join(projectDir, path.dirname(files[0]));
  const rootConfigPath = path.join(projectDir, CONFIG_FILENAME);
  return loadConfigFileInAncestors(localConfigPath, rootConfigPath);
}

// TODO: Add validations
function loadOptions(files, projectDir = process.cwd()) {
  const configFile = loadConfigFile(projectDir, files);
  const { rules: userRulesConfig } = require(configFile);
  //const userRulesDir = require(path.resolve(projectDir, rulesDir));

  const rulesConfig = loadRuleConfigs(userRulesConfig);
  const rules = loadRules();
  return {
    files,
    config: rulesConfig,
    customRules: rules,
  };
}

// TO DO:
// NormalizeConfigs
module.exports = {
  loadOptions,
};
