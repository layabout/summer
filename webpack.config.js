var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoScan = require('./autoScan');

module.exports = {
  entry: autoScan.getEntries(),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[hash].[name].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader?limit=25000&name=img/[hash].[ext]'
      },
      {
        test: /\.html$/,
        loader: "html?attrs=img:src img:data-src"
      }
    ]
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['index','header'],
      minChunks: Infinity
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     minimize:true
    //   },
    //   mangle: {
    //     except: ['$', 'exports', 'require']
    //   }
    // }),
    // new ExtractTextPlugin('css/[name].css'),
    new ExtractTextPlugin('css/style.[contenthash:9].css'),
    new HtmlWebpackPlugin({
      filename: 'views/index.html',
      template: 'modules/index/index.html',
      chunks: ['vendors','index']
    }),
    new HtmlWebpackPlugin({
      filename: 'views/fragments/header.html',
      template: 'modules/components/header/header.html',
      chunks: ['vendors', 'header']
    })
  ],
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 8080,
    inline: true,
    hot: true
  },
  devtool: "source-map"
}
