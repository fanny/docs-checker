/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** The markdown-it return object tokens with many items, and not all are used,
 * This method transforms the token in their string tags.
 */
const path = require('path');
const CONSTANTS = require(path.resolve(__dirname, './constants.js'));
const {TOKENS_TYPE, TOKENS_TAG} = CONSTANTS;

// TODO: More descriptive name
function getSectionsIndexes(tokens) {
  const headingLevels = [...Array(6).keys()];
  let sectionsIndexes = [];
  let idx = 0;

  const teste = [{
    section: 'initial',
    children: []
  }]

  // parse levels: why this code?
  while (!sectionsIndexes.length && idx < headingLevels.length) {
    idx += 1;
    const sectionsbyLevelIndexes = tokens
      .map((token, index) => {
        const isSection =
          token.tag === `h${idx}` && token.type === TOKENS_TYPE.HEADING_OPEN;
        return isSection ? index : null;
      })
      .filter((index) => index !== null);
    if (sectionsbyLevelIndexes.length > 0)
      sectionsIndexes = sectionsbyLevelIndexes;
  }

  return sectionsIndexes;
}

function createSubTree(tokens, currentSection) {
  const parsedTokens = tokens.map((token, idx) => {
    const nestedChildren = tokens.slice(idx + 1);
    return {
      hLevel: token.tag,
      parent: currentSection,
      node: token,
      children:
        token.type !== TOKENS_TYPE.HEADING_OPEN
          ? []
          : createSubTree(nestedChildren, token),
    };
  });
  return parsedTokens;
}

function createContext(tokens) {
  const sectionIndexes = getSectionsIndexes(tokens);
  const tree = [];
  const teste = sectionIndexes[0];
  console.log('Heyy', tokens.slice(0, teste))
  for (let i = 0; i < sectionIndexes.length; i += 1) {
    const currentSection = sectionIndexes[i];
    const nextSection = sectionIndexes[i + 1];
    const children = tokens.slice(currentSection + 1, nextSection);
    const currentNode = tokens[currentSection];

    const rootChildren = createSubTree(children, currentNode);
    const sectionRoot = {
      hLevel: currentNode.tag,
      parent: null,
      node: currentNode,
      children: rootChildren,
    };
    tree.push(sectionRoot);
  }
  //console.log(tree);
}

module.exports = {
  createContext,
};
