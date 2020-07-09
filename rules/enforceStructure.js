/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const path = require('path');

const {createContext} = require(path.resolve(__dirname, '../parser'));

module.exports = {
  names: ['enforce-structure'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  function: function rule(params, onError) {
    const {config, tokens, lines, frontMatterLines} = params;
    const {regex = '(h3)((p)+(code)+)+'} = config || {};

    const context = createContext(tokens, frontMatterLines);
    console.log(context);
    /*context.children.forEach((section) => {
      const valid = section.children.filter(
        (child) => child.node.type === 'heading_open',
      );
      valid.map((child) => {
        const leafs = child.children
          .filter((b) => !b.node.type.match('close|inline'))
          .map((a) => a.node.tag);
        const a = leafs.join('');
        return a.match(new RegExp('((p)+(code)+)+'));
      });
    });*/
  },
};
