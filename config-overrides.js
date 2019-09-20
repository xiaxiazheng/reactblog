const path = require('path');
const webpack = require('webpack');
const { override, fixBabelImports, addWebpackPlugin } = require('customize-cra');

module.exports = {
    webpack: function (config, env) {
      // require('react-app-rewire-postcss')(config, true)
  
      config.resolve.alias['@'] = path.resolve(__dirname, 'src/');

      override(addWebpackPlugin(
        new webpack.ProvidePlugin({
          'window.Quill': 'quill/dist/quill.js',
          'Quill': 'quill/dist/quill.js'
        })
      ))(config, env)
  
      // config.output.publicPath = `${process.env.PUBLIC_URL}`
  
      override(fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      }))(config, env)
  
      return config
      //   devServer: function (configFunction) {
      //     return function (proxy, allowedHost) {
      //       const config = configFunction(proxy, allowedHost)
      //       config.publicPath = `${process.env.PUBLIC_URL}`
      //       config.proxy = {
      //         '/api': {
      //           target: 'https://test-bi.xiaojiaoyu100.com',
      //           changeOrigin: true
      //         }
      //       }
      //       return config
      //     }
      //   }
    }
  }