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
    const {regex = '^(h3)((p)+(code)+)+$'} = config || {};

    const context = createContext(tokens);
    /*const [isStructureInvalid, ..._] = context.tokens.filter(
      (item) => !item.structure.match(new RegExp(regex)),
    );

    if(isStructureInvalid){
      const firstToken = isStructureInvalid.tokens[0];

      onError({
        lineNumber: firstToken.lineNumber,
        detail: `This section is not following the recommended structure ${regex}`,
        context: firstToken.line.substr(0, 7),
      });
    }*/
  },
};
