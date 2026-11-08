const { getDefaultConfig } = require('expo/metro-config');
const upstream = require(getDefaultConfig(require('node:path').resolve(__dirname, '..')).transformer.babelTransformerPath);

module.exports.transform = function transform(args) {
  // No conversion, tracing, optimization or geometry changes: exact master XML.
  return upstream.transform(args.filename.endsWith('.svg')
    ? { ...args, src: `module.exports = ${JSON.stringify(args.src)};` }
    : args);
};
