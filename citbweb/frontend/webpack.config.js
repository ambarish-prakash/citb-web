const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // Entry point for your application
  output: {
    path: path.resolve(__dirname, './static/frontend'), // Output directory
    filename: 'main.js' // Output bundle filename
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile .js files using Babel
        exclude: /node_modules/, // Exclude node_modules from transpilation
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ]
}