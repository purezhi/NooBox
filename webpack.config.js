const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = env => {
  x = {
    entry: {
      noobox: './src/popup/NooBox.jsx',
      imageSearch: './src/imageSearch/ImageSearch.jsx',
      background: './src/background/index.js',
      util: './src/js/util.js',
      extractImages: './src/js/extractImages.js',
      options: './src/js/options.js',
      screenshotSearch: './src/js/screenshotSearch.js',
      videoBeyond: './src/js/videoBeyond.js',
      videoControl: './src/js/videoControl.js',
    },
    output: {
      path: path.resolve('dist'),
      filename: 'js/[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/],
          query: {
            presets: ['react', 'env'],
            plugins: [
              "transform-es2015-destructuring",
              "transform-es2015-parameters",
              "transform-object-rest-spread",
            ],
          },
        },
        {
          test: /\.css$/,
          loaders: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.webpack.js', '.js', '.jsx', '.css']
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './src/options.html' },
        { from: './src/popup/popup.html' },
        { from: './src/imageSearch/image.search.html' },
        { from: './src/manifest.json' },
        { from: './fonts/', to: 'font' },
        { from: './images/', to: 'images' },
        { from: './css/', to: 'css' },
        { from: './thirdParty/', to: 'thirdParty' },
      ]),
    ]
  }
  if (!env || !env.dev) {
    x.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }));
    x.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }));
  }
  return x;
}