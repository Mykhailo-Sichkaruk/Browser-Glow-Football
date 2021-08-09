// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#2-builds--project-setup
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    game: './src/client/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      'css-loader',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/client/html/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      template: 'src/client/css/style.html',
    }),
  ],
  
};
