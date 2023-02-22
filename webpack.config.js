const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './client/src/index.js',
	mode: 'production',
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: { presets: ['@babel/env'] }
		}, {
			test: /\.(s(a|c)ss)$/,
			use: ['style-loader', 'css-loader', 'sass-loader']
		},{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		}]
	},
	resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
	output: {
		path: path.resolve(__dirname, 'client/public/'),
		filename: 'bundle.js'
	},
	optimization: {
		usedExports: true,
	},
	devtool: 'source-map'
};
