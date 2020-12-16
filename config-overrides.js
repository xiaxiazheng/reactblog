const path = require("path");
const HelloWorldPlugin = require("./webpackPlugin/HelloWorldPlugin.ts");
// const { addMyOpenLoaderConfig } = require('./webpackPlugin/addOpenLoader.js')
const { getEnvInfo } = require("./utils/index.ts");
const { exec } = require("child_process");

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
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      const devServerConfig = {
        before: (app, server) => {
          app.use("/__open_in_editor", (req, res, next) => {
            console.log(req.url)
            console.log(`code ${req.url.replace("/?path=", "")}`)
            exec(
              `code ${req.url.replace("/?path=", "")}`,
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
