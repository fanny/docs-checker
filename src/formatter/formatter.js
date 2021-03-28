const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const plur = require('plur')
const logSymbols = require('log-symbols')
const codeFrame = require('babel-code-frame')

function formatter(results) {
  let errorCount = 0
  let warningCount = 0

  const filesOutput = results.map((result) => {
    const fileContent = fs.readFileSync(result.filePath, 'utf8')
    
    const ruleId = chalk.dim(`(${result.ruleName})`)

    let symbol = logSymbols.error
    errorCount++

    return [
      `  ${symbol} ${result.detail} ${ruleId}`,
      `${codeFrame(fileContent, result.line, result.column)}`
    ].join('\n')

    //const filename = chalk.underline(path.relative('.', file))

    //return `  ${filename}\n\n${messagesOutput.join('\n\n')}`
  })


  let finalOutput = `${filesOutput.filter(s => s).join('\n\n\n')}\n\n`

  if (errorCount > 0) {
    finalOutput += `  ${chalk.red(`${errorCount}  ${plur('error', errorCount)}`)}\n`
  }

  if (warningCount > 0) {
    finalOutput += `  ${chalk.yellow(`${warningCount} ${plur('warning', warningCount)}`)}\n`
  }

  return (errorCount + warningCount) > 0 ? finalOutput : ''
}

  

// use a formatter like that: https://github.com/adriantoine/eslint-codeframe-formatter#readme
module.exports = {
  formatter,
};
