const path = require('path');

const requireStructure = require(path.resolve(
  __dirname,
  './requireStructure.js',
));

const requireSectionBefore = require(path.resolve(
  __dirname,
  './requireSectionBefore.js',
));

const requireSectionAfter = require(path.resolve(
  __dirname,
  './requireSectionAfter.js',
));

const noLongSections = require(path.resolve(__dirname, './noLongSections.js'));

const requireLinkInCodeSignature = require(path.resolve(
  __dirname,
  './requireLinkInCodeSignature.js',
));

module.exports = [
  requireStructure,
  requireSectionBefore,
  requireSectionAfter,
  noLongSections,
  requireLinkInCodeSignature,
];
