const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: 'eval-source-map',
  optimization: {
    runtimeChunk: false,
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              plugins: [
                tailwindcss(),
                autoprefixer()
              ]
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(), // For webpack 1.x only
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // For webpack 1.x only
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
});
