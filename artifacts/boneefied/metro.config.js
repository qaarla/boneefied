const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Bundle the authentic SVG text offline, rather than treating it as a raster
// image asset. The viewer renders it through react-native-svg on every platform.
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('./scripts/svg-xml-transformer.cjs');
module.exports = config;
