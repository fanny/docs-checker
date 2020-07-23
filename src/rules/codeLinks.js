/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

const WORDS_PER_MINUTE = 275;
// Regular expression for inline links and shortcut reference links
const linkRe = /\[(?:[^[\]]|\[[^\]]*\])*\](?:\(\S*\))?/g;

function transverseTree(structure, currentNode, onError) {
  const {children, hLevel, node} = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  if(node.line.replace(node.markup, '').trim() === structure.title){
    const isNotLink = subsections.find(section => {
      const text = section.node.line.replace(section.node.markup, '').trim();
      return !text.match(linkRe) || !text.match(linkRe).length
    })

    if(isNotLink){
      onError({
        lineNumber: isNotLink.node.lineNumber,
        detail: 'Long section, consider it break in more sections or include a visual element',
        context: isNotLink.node.line.substr(0, 7),
      });
    }
  } else{
    subsections.forEach((subSection) => {
      transverseTree(structure, subSection, onError);
    });
  }
}

module.exports = {
  names: ['code-links'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {tokens, config, frontMatterLines} = params;
    const context = createContext(tokens, frontMatterLines);
    transverseTree(config, context, onError);
  },
};
