const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/client/index.js", // bundle's entry point
    output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),

  },
  
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    } 
},
module: {
  rules: [
      // JavaScript
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
      },
      //Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // CSS, PostCSS, Sass
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
  ],
},
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/client/html/index.html',
  }),
  new MiniCssExtractPlugin(),
],

};
