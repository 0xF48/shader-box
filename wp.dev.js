webpack = require("webpack")
cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{ test: /\.coffee$/, use: "coffee-loader"},
			{ test: /\.glsl$/, use: "glsl-template-loader" }
		]
	},
	entry: {"example.bundle": __dirname+"/src/example.coffee" },
	resolve: { "modules": ["node_modules"] },
	output: {
		path: __dirname+'/',
		publicPath: '/',
		filename: "[name].js"
	},

	devServer: {
		port: 3033,
		contentBase: __dirname,
		compress: true
	}
}
module.exports = cfg