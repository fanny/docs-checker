const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

// Regular expression for inline links and shortcut reference links
const linkRe = /\[(?:[^[\]]|\[[^\]]*\])*\](?:\(\S*\))?/g;

function transverseTree(config, currentNode, onError) {
  const {children, hLevel, node} = currentNode;
  const subsections = children.filter((child) => child.hLevel);
  const textSection = node.line.replace(node.markup, '').trim();

  if(textSection === config.title){
    const nonLinkSection = subsections.find(section => {
      const text = section.node.line.replace(section.node.markup, '').trim();
      return !text.match(linkRe) || !text.match(linkRe).length
    })

    if(nonLinkSection){
      onError({
        lineNumber: nonLinkSection.node.lineNumber,
        detail: 'Your section should include a link',
        context: nonLinkSection.node.line.substr(0, 7),
      });
    }
  } else{
    subsections.forEach((subSection) => {
      transverseTree(config, subSection, onError);
    });
  }
}

module.exports = {
  names: ['require-link-in-code-signature'],
  description: 'Ensures that code sections include a link for the source code.',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {tokens, config, frontMatterLines} = params;
    const context = createContext(tokens, frontMatterLines);
    transverseTree(config, context, onError);
  },
};
