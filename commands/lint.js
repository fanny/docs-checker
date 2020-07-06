/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// use chalk to run
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
