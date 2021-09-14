const { getEnvInfo } = require("./utils/index.ts");
const path = require("path");

const HelloWorldPlugin = require("./webpackPlugin/HelloWorldPlugin.ts");

// 引入 loader 修改的配置
// const addLoaderConfig = require('./openInVscode/addLoaderConfig.ts');
// 引入 webpack 起的服务的中间件
const devServerMiddleware = require("./openInVscode/devServerMiddleware.ts");

const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const {
    override,
    addWebpackAlias,
    addWebpackExternals,
    fixBabelImports,
    addWebpackPlugin,
} = require("customize-cra");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
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
                echarts: "echarts",
                "markdown-it": "markdownit",
                "_": "lodash",
            }),
            // addWebpackPlugin(
            //   new HelloWorldPlugin({ options: true })
            // ),
            addWebpackAlias({
                // eslint-disable-next-line no-useless-computed-key
                ["@"]: path.resolve(__dirname, "src"),
            }),
            fixBabelImports("import", {
                libraryName: "antd",
                libraryDirectory: "es",
                style: "css",
            })
        )(config, env);

        if (process.env.OPEN_ANALYSIS) {
            override(addWebpackPlugin(new BundleAnalyzerPlugin()))(config, env);
        }

        // 特别配置一下 HtmlWebpackPlugin，用于在页面注入数据
        handleHTMLPlugin(config.plugins);

        // 给页面元素加上对应的组件路径
        // if (env !== 'production') {
        //   config = addLoaderConfig(config);
        // }

        if (env === "production") {
            config.devtool = "none";
        }

        // 去掉只能用 src 文件夹内的文件的限制
        config.resolve.plugins = config.resolve.plugins.filter(
            (plugin) => !(plugin instanceof ModuleScopePlugin)
        );

        // 添加 react-hot-loader，用来支持模块热替换 HMR
        config = rewireReactHotLoader(config, env);
        return config;
    },
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);

            const devServerConfig = {
                before: (app, server) => {
                    // 监听打开 vscode 的请求
                    devServerMiddleware(app);
                },
            };

            return Object.assign(config, devServerConfig);
        };
    },
};
