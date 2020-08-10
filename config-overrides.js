const path = require('path');
const HelloWorldPlugin = require('./webpackPlugin/HelloWorldPlugin.ts')

const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  fixBabelImports,
  addWebpackPlugin
} = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

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
        new HelloWorldPlugin({ options: true })
      ),
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

    // 添加 react-hot-loader，用来支持模块热替换 HMR
    config = rewireReactHotLoader(config, env)
    return config
  }
}