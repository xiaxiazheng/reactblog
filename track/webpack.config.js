const path = require('path')

module.exports = {
  // mode: 'development',
  // mode: 'production',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'track.js',
    libraryTarget: 'umd2'
  }
}