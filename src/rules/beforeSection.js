/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

function transverseTree(config, currentNode, onError) {
  const {children, hLevel, node} = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  // If after key was not defined in config, the section should be the first
  if (!structure.before.length) {
    if (node.line.includes(structure.title)) {
      onError({
        lineNumber: 1,
        detail: 'Your section is not following the recommended structure',
        context: node.line.substr(0, 7),
      });
    }
  } else {
    const sectionIndex = subsections.findIndex((child) => {
      return child.node.line.includes(config.section);
    });

    if (sectionIndex !== -1) {
      const beforeSection = sections[sectionIndex - 1];
      if (beforeSection.node.line !== config.before) {
        onError({
          lineNumber: beforeSection.node.lineNumber,
          detail: 'Your section is not following the recommended structure',
          context: beforeSection.node.line.substr(0, 7),
        });
      }
    } else {
      subsections.forEach((subSection) => {
        transverseTree(config, subSection, onError);
      });
    }
  }
}

module.exports = {
  names: ['before-section'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {config, tokens, frontMatterLines} = params;

    const context = createContext(tokens, frontMatterLines);
    transverseTree(config, context, onError);
  },
};
