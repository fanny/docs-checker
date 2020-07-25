const path = require('path');
const globby = require('globby');

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

function loadOptions(files, projectDir = process.cwd()) {
  const configPath = path.resolve(projectDir, CONFIG_FILENAME);
  const { rules: userRulesConfig } = require(configPath);
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
