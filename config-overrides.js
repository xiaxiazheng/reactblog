const path = require("path");
const HelloWorldPlugin = require("./webpackPlugin/HelloWorldPlugin.ts");
// const { addMyOpenLoaderConfig } = require('./webpackPlugin/addOpenLoader.js')
const { getEnvInfo } = require("./utils/index.ts");
const { exec } = require("child_process");
const url = require('url')

const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  fixBabelImports,
  addWebpackPlugin,
} = require("customize-cra");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

// 找某个webpack plugin
function findPlugin(plugins, nameMatcher) {
  return plugins.find((plugin) => {
    return (
      plugin.constructor &&
      plugin.constructor.name &&
      nameMatcher(plugin.constructor.name)
    );
  });
}

// 添加给页面元素加上对应的组件路径的 loader
function addMyOpenLoaderConfig(config) {
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: path.resolve(__dirname, "./src"),
    exclude: [/node_modules/],
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-react-app"],
        },
      },
      {
        loader: path.resolve(__dirname, "./webpackPlugin/addOpenLoader.ts"),
      },
    ],
  });

  return config;
}

async function handleHTMLPlugin(plugins) {
  const htmlPlugin = findPlugin(plugins, (name) =>
    /HtmlWebpackPlugin/i.test(name)
  );
  // 注入到页面的对象
  // const { getEnvInfo } = require('./env-info')
  const envInfo = await getEnvInfo();
  htmlPlugin.options.injectObj = JSON.stringify(envInfo);
  // console.log(`htmlPlugin: `, htmlPlugin)
}

module.exports = {
  webpack: function (config, env) {
    override(
      addWebpackExternals({
        react: "React",
        "react-dom": "ReactDOM",
        "highlight.js": "hljs",
        quill: "Quill",
      }),
      // addWebpackPlugin(
      //   new HelloWorldPlugin({ options: true })
      // ),
      // addWebpackPlugin(
      //   new BundleAnalyzerPlugin(),
      // ),
      // addWebpackPlugin(
      //   new CompressionPlugin()
      // ),
      addWebpackAlias({
        // eslint-disable-next-line no-useless-computed-key
        ["@"]: path.resolve(__dirname, "src"),
        // ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, 'src/assets/antdIcon.ts')
      }),
      fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: "css",
      })
    )(config, env);

    // 特别配置一下 HtmlWebpackPlugin，用于在页面注入数据
    handleHTMLPlugin(config.plugins);

    // 给页面元素加上对应的组件路径
    if (env !== 'production') {
      config = addMyOpenLoaderConfig(config);
    }

    // 添加 react-hot-loader，用来支持模块热替换 HMR
    config = rewireReactHotLoader(config, env);
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      const devServerConfig = {
        before: (app, server) => {
          app.use("/__open_in_editor", (req, res, next) => {
            const params = url.parse(req.url, true).query
            
            console.log(req.url)
            console.log(`code -g ${params.path}:${params.line}:${params.col}`)
            
            exec(
              `code -g ${params.path}:${params.line}:${params.col}`,
              (error, stdout, stderr) => {
                if (error) {
                  console.error(`执行的错误: ${error}`);
                  return;
                }
                // console.log(`stdout: ${stdout}`);
                // console.error(`stderr: ${stderr}`);
              }
            );
          });
        },
      };

      return Object.assign(config, devServerConfig);
    };
  },
};
