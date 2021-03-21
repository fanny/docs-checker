const path = require('path');
const CONSTANTS = require(path.resolve(__dirname, './constants.js'));
const { TOKENS_TYPE, SUPPRESS_COMMENT_RE } = CONSTANTS;

function getPrecedence(node) {
  return parseInt(node.hLevel.slice(-1)[0]);
}

function createHeadingHierarchy(tokens, root) {
  const rootCopy = Object.assign({}, root);
  const stack = [rootCopy];
  let topStackHeading = stack[0];
  let isSectionDisabled = false;

  tokens.forEach((token) => {
    const tokenRepresentation = {
      hLevel: token?.type === TOKENS_TYPE.HEADING_OPEN ? token.tag : null,
      node: token,
      children: [],
    };

    if (token?.type === TOKENS_TYPE.HEADING_OPEN) {
      if(isSectionDisabled) {
        isSectionDisabled = false;
      }
       else {
        if (getPrecedence(tokenRepresentation) <= getPrecedence(topStackHeading)) {
          while (
            getPrecedence(tokenRepresentation) <= getPrecedence(topStackHeading) &&
            stack.length
          ) {
            topStackHeading = stack.pop();
          }
        }
        topStackHeading.children.push(tokenRepresentation);
        stack.push(...[topStackHeading, tokenRepresentation]);
        topStackHeading = tokenRepresentation;
      }
    } else {
      if(SUPPRESS_COMMENT_RE.test(token.content)){
        [_, command] = SUPPRESS_COMMENT_RE.exec(token.content);
        isSectionDisabled = true
      }
      if(!isSectionDisabled){
        topStackHeading.children.push(tokenRepresentation);
      }
    }
  });

  return rootCopy;
}

function createContext(tokens) {
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
      markup: '#',
      info: '',
      meta: null,
      block: true,
      hidden: false,
    },
    children: [],
  };
  const tree = createHeadingHierarchy(tokens, rootSection);
  return tree;
}

module.exports = {
  createContext,
};
