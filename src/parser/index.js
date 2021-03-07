const path = require('path');
const CONSTANTS = require(path.resolve(__dirname, './constants.js'));
const { TOKENS_TYPE, TOKENS_TAG } = CONSTANTS;

function isLeaf(node) {
  return node && !node.children.length;
}

function isSubSection(child) {
  return child.node.type === TOKENS_TYPE.HEADING_OPEN;
}

function isNestedChild(parentHLevel, nodeHLevel) {
  return !parentHLevel || !nodeHLevel || nodeHLevel > parentHLevel;
}

/**
 * This method receives the current node (initially the root) and the node to be added
 * First, it will be check if the current node has a children, if not, it will be the current node
 * Second, in case of the current node has a children, if exists, get its leaf, then check if it's a section,
 * the parent section should be the nearest, so return the subsection, otherwise the current node
 * Third, if the child is not a leaf, we need to check if it's necessary keeping iterating,
 * so, we check the level of the current node, in case of the node to be added has a level greater than
 * the current node, we should keep searching, otherwise we just return the current node.
 */
function getParent(currentNode, node) {
  const [lastChild] = currentNode.children.slice(-1);
  if (!lastChild) {
    return currentNode;
  } else if (isLeaf(lastChild)) {
    return isSubSection(lastChild) ? lastChild : currentNode;
  } else {
    const lastChildHLevel =
      lastChild && lastChild.hLevel && parseInt(lastChild.hLevel.slice(-1)[0]);
    const nodeHLevel = node.hLevel && parseInt(node.hLevel.slice(-1)[0]);

    return isNestedChild(lastChildHLevel, nodeHLevel)
      ? getParent(lastChild, node)
      : currentNode;
  }
}

function createSubTree(tokens, currentSection) {
  const tree = { ...currentSection };
  const parsedTokens = tokens.forEach((token, idx) => {
    const node = {
      hLevel: token.type === TOKENS_TYPE.HEADING_OPEN ? token.tag : null,
      node: token,
      children: [],
    };

    const parent = getParent(tree, node);
    parent.children.push(node);
  });
  return tree;
}

function headingEvaluation(tokens, root) {
  stack = [root, tokens[0]]
  elemsStack = []
  index = 0
  while(stack.length) {
    top = stack.pop()
    const node = {
      hLevel: top?.type === TOKENS_TYPE.HEADING_OPEN ? top.tag : null,
      node: top,
      children: [],
    };

    if(top?.type == TOKENS_TYPE.HEADING_OPEN || index == tokens.length-1 ) {
      if(stack.length != 0) {
        let previous = stack.pop()
        previous.children.push(...elemsStack) // required
        if(index == tokens.length-1) {
          stack = []
        } else {
          if(parseInt(previous.hLevel.slice(-1)[0]) >=  parseInt(node.hLevel.slice(-1)[0])) {
            while(parseInt(previous.hLevel.slice(-1)[0]) >=  parseInt(node.hLevel.slice(-1)[0]))
              previous = stack.pop()
          }
          previous.children.push(node)
          elemsStack = []
          stack.push(...[previous, node])
        }
      }
    } else {
      elemsStack.push(node)
    }

    index += 1
    if(index < tokens.length)
      stack.push(tokens[index])
  }

  return root
}

function createContext(tokens, frontMatter) {
  const rootSection = {
    hLevel: 'h1',
    node: {
      type: 'heading_open',
      tag: 'h1',
      attrs: null,
      map: [1],
      nesting: 1,
      level: 0,
      children: null,
      content: '',
      markup: '##',
      info: '',
      meta: null,
      block: true,
      hidden: false,
      line: frontMatter[2],
      lineNumber: 1,
    },
    children: [],
  };
  const tree = headingEvaluation(tokens, rootSection);
  
  console.log(frontMatter)
  console.log(tree)
  console.log('\n\n\n')
  return tree;
}

module.exports = {
  createContext,
};
