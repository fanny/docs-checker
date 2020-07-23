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

const beforeSection = require(path.resolve(
  __dirname,
  './beforeSection.js',
));

const afterSection = require(path.resolve(
  __dirname,
  './afterSection.js',
));

const timeLecture = require(path.resolve(
  __dirname,
  './timeLecture.js',
));

const codeLinks = require(path.resolve(
  __dirname,
  './codeLinks.js',
));

module.exports = [
  enforceStructure,
  beforeSection,
  afterSection,
  timeLecture,
  codeLinks
];
