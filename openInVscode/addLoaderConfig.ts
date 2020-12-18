/**
 * 在 cra 的 webpack 配置中加上自定义 loader
 */
const path = require('path')

// 添加给页面元素加上对应的组件路径的 loader
function addMyOpenLoaderConfig(config) {
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: path.resolve(__dirname, "../src"),
    exclude: [/node_modules/],
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-react-app"],
        },
      },
      {
        loader: path.resolve(__dirname, "./addOpenLoader.ts"),
      },
    ],
  });

  return config;
}

module.exports = addMyOpenLoaderConfig