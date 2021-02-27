const fs = require('fs');
const path = require('path');

const { createContext } = require(path.resolve(__dirname, '../parser'));


function getTokensRegex(tokens) {
  return Object.entries(tokens).map(([key, value]) =>
    value === 'optional' ? `(${key})?` : key,
  )
}

function getValidTokens(structure, hLevel) {
  const tokens = structure?.[hLevel]
  if(!tokens) return []

  return Array.isArray(tokens) ?
    tokens.map(getTokensRegex)
      .map((token) => token.join(''))
      .join('|') // explain why
    : getTokensRegex(tokens).join('')
}

function transverseTree(structure, currentNode, onError) {
  const { children, hLevel } = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  const validTokens = getValidTokens(structure, hLevel);

  const nodeTags = children.filter(
    (child) => !child.node.type.match('close|inline'),
  );

  if (validTokens.length) {
    const tokensRegex = `(${validTokens})+`; // TODO: Rever
    console.log(tokensRegex)
    const tagsRepresentation = nodeTags.map((child) => child.node.tag).join('');
    //console.log(`tokens: ${tokensRegex}\n\n`)
    //console.log(`tagsRepresentation: ${tagsRepresentation}\n\n`)
    //console.log(`test: ${tagsRepresentation.match(tokensRegex)}\n\n`)

    if (!tagsRepresentation.match(tokensRegex)) {
      onError({
        lineNumber: currentNode.node.lineNumber,
        detail: 'Your section is not following the recommended structure',
        context: currentNode.node.line.substr(0, 7),
      });
    }
  }

  subsections.forEach((subSection) => {
    transverseTree(structure, subSection, onError);
  });
}

module.exports = {
  names: ['require-structure'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const { config, tokens, lines, frontMatterLines } = params;
    const { structure } = config || {};
    const context = createContext(tokens, frontMatterLines);
    console.log(`here: ${frontMatterLines}`);
    transverseTree(structure, context, onError);
  },
};
