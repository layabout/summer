var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');

var debug = process.env.NODE_ENV !== 'production';
//发布目录
var assetsTarget = debug ? 'dist' : '../assets';
var htmlTarget = debug ? 'views' : '../WEB-INF/templates';

//获取入口文件
var entries = getEntry('modules/**/*.entry.js', 'modules/');
//剥离jquery组件
entries['vendors'] = ['jquery'];

var chunks = Object.keys(entries);

var webpackConfig = {
  entry: entries,
  output: {
    path: path.join(__dirname, assetsTarget),
    publicPath: (debug ? '/' : 'assets/'),
    filename: 'js/[hash:10].[name].js',
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
        loader: "html?-minimize&attrs=img:src img:data-src"
      }
    ]
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: 3
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: {
        except: ['$', 'exports', 'require']
      }
    }),
    new ExtractTextPlugin('css/style.[contenthash:9].css')
  ],
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 8080,
    inline: true,
    hot: true
  },
  devtool: (debug ? 'source-map' : '')
}

//生成html配置
var pages = getEntry('modules/**/*.html', 'modules/');
var pageKeys = Object.keys(pages);
pageKeys.forEach(function(pathname) {
  if(pathname != 'vendors') {
    var conf = {
      filename: htmlTarget + '/' + pathname + '.html',
      template: pages[pathname][0],
      chunks: ['vendors', pathname],
      minify: {
        removeComments:true
      }
    }
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
  }
});

module.exports = webpackConfig;

//扫描入口文件
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        var filename = basename.split('.')[0];
        if(extname == '.js')
          console.log('==== Find entry file ====>>> ' + entry);
        entries[filename] = ['./' + entry];
    }
    return entries;
}
