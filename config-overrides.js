const { getEnvInfo } = require("./utils/index.ts");
const path = require("path");

const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const {
    override,
    addWebpackAlias,
    addWebpackExternals,
    addWebpackPlugin,
} = require("customize-cra");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

module.exports = {
    webpack: function (config, env) {
        override(
            addWebpackExternals({
                react: "React",
                "react-dom": "ReactDOM",
                "highlight.js": "hljs",
            }),
            addWebpackAlias({
                // eslint-disable-next-line no-useless-computed-key
                ["@"]: path.resolve(__dirname, "src"),
            }),
        )(config, env);

        if (process.env.OPEN_ANALYSIS) {
            override(addWebpackPlugin(new BundleAnalyzerPlugin()))(config, env);
        }

        config.devtool = 'source-map';

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

            return config;
        };
    },
};
