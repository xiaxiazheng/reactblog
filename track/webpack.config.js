const path = require('path')

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'track.js',
    libraryTarget: 'umd2'
  }
}