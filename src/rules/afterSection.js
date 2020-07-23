/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

function transverseTree(structure, currentNode, onError) {
  const {children, hLevel} = currentNode;
  const sections = children.filter((child) => child.hLevel);

  if(!structure.after.length){
    const [lastSection] = sections.slice(-1);
    if(!lastSection || !lastSection.node.line.includes(structure.title)){
      onError({
        lineNumber: lastSection.node.lineNumber,
        detail: 'Your section is not following the recommended structure',
        context: lastSection.node.line.substr(0, 7),
      });
    }
  } else {
    const desiredSectionIndex = sections
      .findIndex((child) => {
        return child.node.line.includes(structure.title)
      });
    if(desiredSectionIndex !== -1) {
      const afterSection = sections[desiredSectionIndex + 1];
      if(afterSection.node.line !== structure.after) {
        onError({
          lineNumber: afterSection.node.lineNumber,
          detail: 'Your section is not following the recommended structure',
          context: afterSection.node.line.substr(0, 7),
        });
      }
    } else {
      const subsections = children.filter((child) => child.hLevel);
      subsections.forEach((subSection) => {
        transverseTree(structure[hLevel], subSection, onError);
      });
    }
  }
}

module.exports = {
  names: ['after-section'],
  description: 'After a section',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {config, tokens, frontMatterLines} = params;

    const context = createContext(tokens, frontMatterLines);
    transverseTree(config, context, onError);
  },
};
