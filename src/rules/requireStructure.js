/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

function transverseTree(structure, currentNode, onError) {
  const {children, hLevel} = currentNode;
  const validTokens = Object.entries(structure[hLevel])
    .filter(([key, value]) => value !== 'optional')
    .map(([key, _]) => key);

  const subsections = children.filter((child) => child.hLevel);
  const invalid = children
    .filter((child) => !child.node.type.match('close|inline'))
    .find(
      (child) => {
        return !validTokens.includes(child.node.tag) && child.node.tag !== ''
      }
    );

  if (invalid) {
    onError({
      lineNumber: invalid.node.lineNumber,
      detail: 'Your section is not following the recommended structure',
      context: invalid.node.line.substr(0, 7),
    });
  }

  subsections.forEach((subSection) => {
    transverseTree(structure[hLevel], subSection, onError);
  });
}

module.exports = {
  names: ['require-structure'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {config, tokens, lines, frontMatterLines} = params;
    const {structure} = config || {};

    const context = createContext(tokens, frontMatterLines);
    transverseTree(structure, context, onError);
  },
};
