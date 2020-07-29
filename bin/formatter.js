const chalk = require("chalk"),
    stripAnsi = require("strip-ansi"),
    table = require("text-table");

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

function formatter(results) {
  let output = '\n';

  Object.keys(results).forEach((file) => {
    const resultValues = results[file];

    output += `${chalk.underline(file)}\n`;

    output += `${table(
      resultValues.map((resultValue) => {
        const messageType = chalk.yellow('warning');
        return [
          '',
          resultValue.lineNumber || 0,
          0,
          messageType,
          resultValue.errorDetail.replace(/([^ ])\.$/u, '$1'),
          chalk.dim(resultValue.ruleNames[0] || ''),
        ];
      }),
      {
        align: ['', 'r', 'l'],
        stringLength(str) {
          return stripAnsi(str).length;
        },
      },
    )
      .split('\n')
      .map((el) =>
        el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)),
      )
      .join('\n')}\n\n`;
  });

  return chalk.reset(output);
}

module.exports = {
  formatter
}
