const TOKENS_TYPE = {
  HEADING_OPEN: 'heading_open',
  INLINE: 'inline',
};

const TOKENS_TAG = {
  H2: 'h2',
  H3: 'h3',
};

const SUPPRESS_COMMENT_RE = /<!--\s*docs-checker-(?:(disable-next-line))\s*-->/gi

module.exports = {
  TOKENS_TYPE,
  TOKENS_TAG,
  SUPPRESS_COMMENT_RE
};
