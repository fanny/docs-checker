const markdownlint = require('markdownlint');
const path = require('path');

function lint(options) {
  markdownlint(options, function (err, result) {
    if (!err) {
      console.warn(result.toString());
    }
  });
}

module.exports = {
  lint,
};
