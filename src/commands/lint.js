const markdownlint = require('markdownlint');
const path = require('path');
const { formatter } = require('../../bin/formatter.js');

function lint(options) {
  markdownlint(options, function (err, result) {
    if (!err) {
      console.log(formatter(result));
    }
  });
}

module.exports = {
  lint,
};
