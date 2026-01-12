const path = require('path');
const fs = require('fs');
const { rspack } = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// 获取环境变量
const getPublicUrl = () => {
  const envPublicUrl = process.env.PUBLIC_URL;
  return envPublicUrl ? envPublicUrl.replace(/\/$/, '') : '';
};

const publicUrl = getPublicUrl();

// 创建一个处理 HTML 模板的函数，替换 %PUBLIC_URL%
const getHtmlTemplateContent = () => {
  const htmlPath = path.resolve(__dirname, 'public/index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  // 替换 %PUBLIC_URL%
  html = html.replace(/%PUBLIC_URL%/g, publicUrl || '');
  return html;
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.tsx',
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    clean: true,
    publicPath: publicUrl + '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  decorators: false,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
                target: 'es5',
                loose: false,
                externalHelpers: false,
                keepClassNames: false,
              },
              module: {
                type: 'es6',
              },
              minify: false,
              isModule: true,
            },
          },
        ],
      },
      {
        test: /\.module\.(scss|sass|css)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              modules: {
                mode: (resourcePath) => {
                  if (/\.module\.(scss|sass|css)$/i.test(resourcePath)) {
                    return 'local';
                  }
                  return 'global';
                },
                getLocalIdent: (context, localIdentName, localName) => {
                  const crypto = require('crypto');
                  const path = require('path');
                  // 使用相对于项目根目录的路径，确保相同文件总是生成相同的哈希
                  // context.rootContext 是项目的根目录（通常是 __dirname）
                  // context.resourcePath 是资源文件的路径
                  const rootContext = context.rootContext || __dirname;
                  const resourcePath = path.resolve(rootContext, context.resourcePath);
                  // 获取相对于项目根目录的路径，统一使用正斜杠
                  const relativePath = path.relative(rootContext, resourcePath).replace(/\\/g, '/');
                  // 使用相对路径和类名生成唯一的哈希
                  const hash = crypto
                    .createHash('md5')
                    .update(relativePath + localName)
                    .digest('hex')
                    .substring(0, 8);
                  
                  if (isDevelopment) {
                    // 开发环境：包含路径信息，便于调试
                    const match = relativePath.match(/src[\\/](.+)$/);
                    if (match) {
                      const pathStr = match[1].replace(/[\\/]/g, '__').replace(/\.module\.(scss|sass|css)$/i, '');
                      return `${pathStr}__${localName}--${hash}`;
                    }
                  }
                  // 生产环境：使用简洁的类名+哈希
                  return `${localName}--${hash}`;
                },
                exportLocalsConvention: 'camelCase',
                exportOnlyLocals: false,
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  [
                    require.resolve('autoprefixer'),
                    {
                      overrideBrowserslist: [
                        '>0.2%',
                        'not dead',
                        'not op_mini all',
                      ],
                    },
                  ],
                ],
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: isDevelopment,
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass|css)$/,
        exclude: /\.module\.(scss|sass|css)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  [
                    require.resolve('autoprefixer'),
                    {
                      overrideBrowserslist: [
                        '>0.2%',
                        'not dead',
                        'not op_mini all',
                      ],
                    },
                  ],
                ],
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: isDevelopment,
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'build'),
          globOptions: {
            ignore: ['**/index.html'], // 忽略 index.html，因为 HtmlRspackPlugin 会处理
          },
        },
      ],
    }),
    new rspack.HtmlRspackPlugin({
      templateContent: getHtmlTemplateContent(),
      inject: true,
      minify: isProduction,
    }),
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || (isProduction ? 'production' : 'development')),
      'process.env.PUBLIC_URL': JSON.stringify(publicUrl),
      'process.env.REACT_APP_IS_LocalHost': JSON.stringify(process.env.REACT_APP_IS_LocalHost || ''),
      'process.env.REACT_APP_IS_LOCALSTATIC': JSON.stringify(process.env.REACT_APP_IS_LOCALSTATIC || ''),
      'process.env.NEXT_PUBLIC_IS_LOCAL': JSON.stringify(process.env.NEXT_PUBLIC_IS_LOCAL || ''),
      'process.env.NEXT_PUBLIC_IS_LOCAL_STATIC': JSON.stringify(process.env.NEXT_PUBLIC_IS_LOCAL_STATIC || ''),
      ...Object.keys(process.env)
        .filter((key) => key.startsWith('REACT_APP_') || key.startsWith('NEXT_PUBLIC_'))
        .reduce(
          (env, key) => {
            env[`process.env.${key}`] = JSON.stringify(process.env[key]);
            return env;
          },
          {}
        ),
    }),
    ...(isDevelopment ? [new ReactRefreshPlugin()] : []),
  ],
  devServer: {
    port: 3002,
    hot: true,
    open: false,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  devtool: isProduction ? false : 'cheap-module-source-map',
  optimization: {
    minimize: isProduction,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
};
