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

function isLeaf(node){
  return node && !node.children.length
}

function isSubSection(child){
  return child.node.type === TOKENS_TYPE.HEADING_OPEN;
}

function isNestedChild(parentHLevel, nodeHLevel) {
  return !parentHLevel || !nodeHLevel || nodeHLevel > parentHLevel;
}

function getParent(currentNode, node) {
  const [lastChild] = currentNode.children.slice(-1);
  if (isLeaf(lastChild)) {
    return isSubSection(lastChild) ? lastChild : currentNode;
  } else if (!lastChild) {
    return currentNode;
  } else {
    const lastChildHLevel =
      lastChild && lastChild.hLevel && parseInt(lastChild.hLevel.slice(-1)[0]);

    const nodeHLevel = node.hLevel && parseInt(node.hLevel.slice(-1)[0]);

    return isNestedChild(lastChild, nodeHLevel)
      ? getParent(lastChild, node)
      : currentNode;
  }
}

function createSubTree(tokens, currentSection) {
  const tree = {...currentSection};
  const parsedTokens = tokens.forEach((token, idx) => {
    const node = {
      hLevel: token.type === TOKENS_TYPE.HEADING_OPEN ? token.tag : null,
      node: token,
      children: [],
    };

    const lastChild = getParent(tree, node);
    tree.children.push(node);
  });
  return tree;
}

function createContext(tokens, frontMatter) {
  const rootSection = {
    hLevel: 'h1',
    node: frontMatter[2],
    children: [],
  };
  const tree = createSubTree(tokens, rootSection);
  return tree;
}

module.exports = {
  createContext,
};
