const path = require('path');
const CONSTANTS = require(path.resolve(__dirname, './constants.js'));
const { TOKENS_TYPE } = CONSTANTS;


function getPrecedence(node) {
  return parseInt(node.hLevel.slice(-1)[0])
}

function createHeadingHierarchy(tokens, root) {
  const stack = [root]
  let topStackHeading = stack[0]

  tokens.forEach((token) => {
    const node = {
      hLevel: token?.type === TOKENS_TYPE.HEADING_OPEN ? token.tag : null,
      node: token,
      children: [],
    };

    if(token?.type === TOKENS_TYPE.HEADING_OPEN) {
      if(getPrecedence(node) < getPrecedence(topStackHeading)) {
        while(getPrecedence(node) < getPrecedence(topStackHeading) && stack.length) {
          topStackHeading = stack.pop()
        }
      }
      topStackHeading.children.push(node)
      stack.push(...[topStackHeading, node])
      topStackHeading = node
    } else {
      topStackHeading.children.push(node)
    }
  })

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
  const tree = createHeadingHierarchy(tokens, rootSection);
  return tree;
}

module.exports = {
  createContext,
};
