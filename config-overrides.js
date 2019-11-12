const path = require('path');
// const webpack = require('webpack');
const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  fixBabelImports,
  addWebpackPlugin
} = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CompressionPlugin = require('compression-webpack-plugin');
// const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  webpack: function (config, env) {

    override(
      addWebpackExternals({
        'react': 'React',
        'react-dom': 'ReactDOM',
        'highlight.js': 'hljs',
        'quill': 'Quill',
      }),
      addWebpackPlugin(
        new BundleAnalyzerPlugin(),
      ),
      // addWebpackPlugin(
      //   new CompressionPlugin()
      // ),
      addWebpackAlias({
        // ['@']: path.resolve(__dirname, 'src'),  // TODO，不起作用
        ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, 'src/assets/antdIcon.ts')
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