const path = require('path');
const { TOKENS_TYPE, SUPPRESS_COMMENT_PATTERN } = require(path.resolve(
  __dirname,
  './constants.js',
));

function getPrecedence(node) {
  return parseInt(node.hLevel.slice(-1)[0]);
}

function createHeadingHierarchy(tokens, root) {
  const rootCopy = Object.assign({}, root);
  const stack = [rootCopy];
  let topStackHeading = stack[0];
  let isSectionDisabled = false;

  tokens.forEach((token, index) => {
    const tokenRepresentation = {
      hLevel: token?.type === TOKENS_TYPE.HEADING_OPEN ? token.tag : null,
      node: token,
      children: [],
    };

    if (token?.type === TOKENS_TYPE.HEADING_OPEN) {
      if (
        index !== 0 &&
        tokens[index - 1].content.match(SUPPRESS_COMMENT_PATTERN) === null
      ) {
        isSectionDisabled = false;
      }
      if (!isSectionDisabled) {
        if (
          getPrecedence(tokenRepresentation) <= getPrecedence(topStackHeading)
        ) {
          while (
            getPrecedence(tokenRepresentation) <=
              getPrecedence(topStackHeading) &&
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
      if (token.content.match(SUPPRESS_COMMENT_PATTERN) != null) {
        isSectionDisabled = true;
      }

      if (!isSectionDisabled)
        topStackHeading.children.push(tokenRepresentation);
    }
  });

  return rootCopy;
}

function createContext(tokens) {
  const rootSection = {
    hLevel: 'h1',
    node: {
      type: TOKENS_TYPE.HEADING_OPEN,
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
