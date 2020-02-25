const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const LicenseWebpackPlugin = require('license-webpack-plugin')
  .LicenseWebpackPlugin;

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-source-map',
  optimization: {
    runtimeChunk: {
      name: 'runtime' // All share the same `runtime.js`.
    },
    minimize: true,
    splitChunks: {
      chunks: 'all', // Enables both `initial` and `async` imports.
      minSize: 0,
      cacheGroups: {
        default: false, // Disable the default.
        vendors: false, // Disable the default.
        solid: {
          name: 'solid',
          test: new RegExp('[\\/]node_modules[\\/](solid-js)[\\/]')
        },
        ramda: {
          name: 'ramda',
          test: new RegExp('[\\/]node_modules[\\/](ramda)[\\/]')
        },
        vendor: {
          name: 'vendor',
          test: new RegExp('[\\/]node_modules[\\/](!solid-js)(!ramda)[\\/]')
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [tailwindcss(), autoprefixer()]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new LicenseWebpackPlugin()
  ]
});
