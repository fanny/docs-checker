/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');

const enforceStructure = require(path.resolve(
  __dirname,
  './enforceStructure.js',
));

const beforeOrAfterSection = require(path.resolve(
  __dirname,
  './beforeOrAfterSection.js',
));

module.exports = [enforceStructure, beforeOrAfterSection];
