/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

const WORDS_PER_MINUTE = 275;

function transverseTree(currentNode, onError) {
  const {children, hLevel, node} = currentNode;
  const textSection = children
    .filter((child) => child.node.type === 'paragraph_open')
    .map((child) => child.node.line).join('\n');

  if(textSection){
    const wordCount = textSection.match(/\S+/g).length;
    const estimatedTime = wordCount / WORDS_PER_MINUTE;
    if (estimatedTime > 7) {
      onError({
        lineNumber: node.lineNumber,
        detail: 'Long section, consider it break in more sections or include a visual element',
        context: node.line.substr(0, 7),
      });
    }
  }

const subsections = children.filter((child) => child.hLevel);
  subsections.forEach((subSection) => {
    transverseTree(subSection, onError);
  });
}

module.exports = {
  names: ['no-long-sections'],
  description: 'Prevent sections to take more than 7 minutes to read',
  tags: ['time', 'reading', 'md'],
  function: function rule(params, onError) {
    const {tokens, frontMatterLines} = params;
    const context = createContext(tokens, frontMatterLines);
    transverseTree(context, onError);
  },
};
