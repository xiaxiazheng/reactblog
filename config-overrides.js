const path = require('path');
const webpack = require('webpack');
const {
  override,
  addWebpackAlias,
  fixBabelImports,
  addWebpackPlugin
} = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: function (config, env) {
    // config.resolve.alias['@'] = path.resolve(__dirname, 'src/');

    config.externals = {
      'highlight.js': 'hljs',
      'quill': 'Quill',
    };

    override(
      addWebpackPlugin(
        new webpack.DefinePlugin(BundleAnalyzerPlugin)  // TODO，不起作用
      ),
      addWebpackAlias({
        '@': path.join(__dirname, '..', 'src')  // TODO，不起作用
      }),
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      })
    )(config, env)

    return config
  }
}