webpack = require("webpack")
cfg = {
	module: {
		rules: [

			{ test: /\.coffee$/, use: "coffee-loader"},
			{ test: /\.glsl$/, use: "glsl-template-loader" }
		]
	},
	entry: __dirname+"/src/shader-box.coffee",
	resolve: { "modules": ["node_modules"] },
	output: {
		path: __dirname+'/',
		publicPath: '/',
		filename: "shader-box-var.js",
		library: 'ShaderBox',
		libraryTarget: 'var'
	}
}
module.exports = cfg