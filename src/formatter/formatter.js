const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const plur = require('plur');
const logSymbols = require('log-symbols');
const codeFrame = require('babel-code-frame');

// Inspired by: https://github.com/adriantoine/eslint-codeframe-formatter
function formatter(results) {
  let errorCount = 0;
  let warningCount = 0;

  const filesOutput = Object.keys(results).map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const output = results[filePath].map((result) => {
      const ruleId = chalk.dim(`(${result.ruleName})`);
      const symbol = logSymbols.error;
      errorCount += 1;

      return [
        `  ${symbol} ${result.detail} ${ruleId}`,
        `${codeFrame(fileContent, result.line, result.column)}`,
      ].join('\n');
    });
    const filename = chalk.underline(path.relative('.', filePath));
    return `  ${filename}\n\n${output.join('\n\n')}`;
  });

  const finalOutput = 
    `${filesOutput.filter((s) => s).join('\n\n\n')}\n
      ${chalk.red(
        `${errorCount}  ${plur('error', errorCount)}`,
      )}
      ${chalk.yellow(
        `${warningCount} ${plur('warning', warningCount)}`,
      )}\n`;

  return finalOutput;
}

module.exports = {
  formatter,
};
