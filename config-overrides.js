const path = require('path');

const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  fixBabelImports,
  addWebpackPlugin
} = require('customize-cra');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: function (config, env) {

    override(
      addWebpackExternals({
        'react': 'React',
        'react-dom': 'ReactDOM',
        'highlight.js': 'hljs',
        'quill': 'Quill',
      }),
      // addWebpackPlugin(
      //   new BundleAnalyzerPlugin(),
      // ),
      // addWebpackPlugin(
      //   new CompressionPlugin()
      // ),
      addWebpackAlias({
        ['@']: path.resolve(__dirname, 'src'),
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