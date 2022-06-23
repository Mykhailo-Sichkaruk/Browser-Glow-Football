const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "production",
	entry: {
		index: "./src/client/index.js",
	},
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: {
		fallback: {
			"fs": false,
			"tls": false,
			"net": false,
			"path": false,
			"zlib": false,
			"http": false,
			"https": false,
			"stream": false,
			"crypto": false,
			"constants": false,
			"os": false,
			"vm": require.resolve("vm-browserify"),
			"crypto-browserify": require.resolve("crypto-browserify"), //if you want to use this module also don't forget npm i crypto-browserify
		}
	},
	module: {
		rules: [
			// JavaScript
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, "src/client"),
				use: {
					loader: "babel-loader",
					options: {
						presets: [ "@babel/preset-env", "@babel/preset-react" ]
					}
				},
			},
			//Images
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: "asset/resource",
			},
			// CSS, PostCSS, Sass
			{
				test: /\.css$/i,
				use: [ MiniCssExtractPlugin.loader, "css-loader" ],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/client/html/index.html",
		}),
		new MiniCssExtractPlugin(),
	],
	externals: {
		"react": "React"
	},
	experiments: {
		topLevelAwait: true
	},
	optimization: {
		chunkIds: "natural",
		emitOnErrors: true,
		innerGraph: false,
		mangleExports: "size",
		nodeEnv: "production",
		portableRecords: true,
		// Uncomment line below to disable minimization of names in front-end code. Helpful for debugging.
		// minimize: false,
	},
};
