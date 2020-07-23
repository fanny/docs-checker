/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

function transverseTree(config, currentNode, onError) {
  const {children, hLevel} = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  // If after key was not defined in config, the section should be the last
  if (!config.next.length) {
    const [lastSection] = subsections.slice(-1);
    if (!lastSection || !lastSection.node.line.includes(config.section)) {
      onError({
        lineNumber: lastSection.node.lineNumber,
        detail: 'Your section is not following the recommended config',
        context: lastSection.node.line.substr(0, 7),
      });
    }
  } else {
    const sectionIndex = subsections.findIndex(({node}) => {
      return node.line.includes(config.section);
    });

    if (sectionIndex !== -1) {
      const nextSection = subsections[sectionIndex + 1];
      if (nextSection.node.line !== config.next) {
        onError({
          lineNumber: nextSection.node.lineNumber,
          detail: 'Your section is not following the recommended config',
          context: nextSection.node.line.substr(0, 7),
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
  names: ['require-section-after'],
  description: 'Enforce that a section should be after the specified.',
  tags: ['md', 'config'],
  function: function rule(params, onError) {
    const {config, tokens, frontMatterLines} = params;

    const context = createContext(tokens, frontMatterLines);
    transverseTree(config, context, onError);
  },
};
