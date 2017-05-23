const path = require('path');
const webpack = require('webpack');
const defaultContext = '/fivestaradminstorefront';
// Webpak Dashboard
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();

module.exports = {
  devtool: 'cheap-eval-source-map',
  cache: true,
  context: path.join(__dirname, 'src'),
  entry: {
    // dynamically add by server.js
  },
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: '[name].bundle.js',
    publicPath: `${defaultContext}/_admin/`,
	sourceMapFilename: "[name].map"
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
	proxy:{
		'!(**/_admin/**|/_tmp/**|/**/_admin/|/_tmp/*/**)':{
		
			//target: 'http://localhost:8088',
			//target: 'https://localhost:9002',
			target: 'https://localhost:8079',
			//target:'https://172.26.132.3',
			secure: false
		}
	}
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: '"dev"',
    }),
	new DashboardPlugin(dashboard.setData),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|build/,
        loader: 'react-hot-loader!babel-loader?cacheDirectory=true'
      }, {
        test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};
