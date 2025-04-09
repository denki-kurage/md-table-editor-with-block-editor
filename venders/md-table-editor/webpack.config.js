const path = require('path')

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'index.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve:
  {
    extensions: ['.ts']
  }
}