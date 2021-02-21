const path = require('path');
const MyWebpackPlugin = require('./plugin/index.js')
module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new MyWebpackPlugin()
  ]
}
