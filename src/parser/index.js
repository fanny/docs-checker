function getPrecedence(node) {
  return parseInt(node.hLevel.slice(-1)[0]);
}

function createHeadingHierarchy(tokens, root) {
  const rootCopy = Object.assign({}, root);
  const stack = [rootCopy];
  let topStackHeading = stack[0];

  tokens.forEach((token) => {
    const tokenRepresentation = {
      hLevel: token?.type === 'heading_open' ? token.tag : null,
      node: token,
      children: [],
    };

    if (token?.type === 'heading_open') {
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
    } else {
      topStackHeading.children.push(tokenRepresentation);
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
      line: 'a',
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
