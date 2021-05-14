const path = require('path');

const WORDS_PER_MINUTE = 275;

function transverseTree(currentNode, onError) {
  const { children, hLevel, node } = currentNode;
  const textSection = children
    .filter((child) => child.node.type === 'paragraph_open')
    .map((child) => child.node.content)
    .join('\n');

  if (textSection) {
    const wordCount = textSection.match(/\S+/g).length;
    const estimatedTime = wordCount / WORDS_PER_MINUTE;
    if (estimatedTime > 7) {
      onError({
        line: currentNode.node.map[0],
        detail:
          'Long section, consider it break in more sections or include a visual element',
        context: currentNode.children[0].node.content,
        severity: 2,
      });
    }
  }

  const subsections = children.filter((child) => child.hLevel);
  subsections.forEach((subSection) => {
    transverseTree(subSection, onError);
  });
}

module.exports = {
  name: ['no-long-sections'],
  description: 'Prevent sections to take more than 7 minutes to read',
  tags: ['time', 'reading', 'md'],
  run: function rule(params, onError) {
    const { context } = params;
    transverseTree(context, onError);
  },
};
