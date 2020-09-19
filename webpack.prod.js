/** @prettier */

const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin')
  .LicenseWebpackPlugin;

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-source-map',
  optimization: {
    runtimeChunk: {
      name: 'runtime', // All share the same `runtime.js`.
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
          test: new RegExp('[\\/]node_modules[\\/](solid-js)[\\/]'),
        },
        ramda: {
          name: 'ramda',
          test: new RegExp('[\\/]node_modules[\\/](ramda)[\\/]'),
        },
        pixi: {
          name: 'pixi',
          test: new RegExp('[\\/]node_modules[\\/](pixi.js)[\\/]'),
        },
        pixilegacy: {
          name: 'pixilegacy',
          test: new RegExp('[\\/]node_modules[\\/](pixi.js-legacy)[\\/]'),
        },
        vendor: {
          name: 'vendor',
          test: new RegExp(
            '[\\/]node_modules[\\/](!solid-js)(!ramda)(!p5)(!pixi.js)(!pixi.js-legacy)[\\/]'
          ),
        },
      },
    },
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
          'postcss-loader'
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new LicenseWebpackPlugin(),
  ],
});
