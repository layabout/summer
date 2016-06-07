var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './modules/index/index.entry.js',
	output: {
		path: 'dist',
		filename: 'js/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.less$/,
				loader: "style!css!less"
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			title: 'Test App',
			template: './modules/index/index.html',
			filename: 'index.html'
		})
	]
};
