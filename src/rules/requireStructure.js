const fs = require('fs');
const path = require('path');

const { createContext } = require(path.resolve(__dirname, '../parser'));

function transverseTree(structure, currentNode, onError) {
  const { children, hLevel } = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  const validTokens =
    structure && structure.hasOwnProperty(hLevel)
      ? Object.entries(structure[hLevel]).map(([key, value]) =>
          value === 'optional' ? `(${key})?` : key,
        )
      : [];

  const nodeTags = children.filter(
    (child) => !child.node.type.match('close|inline'),
  );

  if (validTokens.length) {
    const tokensRegex = `(${validTokens.join('')})+`;
    const tagsRepresentation = nodeTags.map((child) => child.node.tag).join('');

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
    transverseTree(structure, context, onError);
  },
};
