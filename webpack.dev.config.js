const path = require('path');
const webpack = require('webpack');
const defaultContext = '/fivestaradminstorefront';
// Webpak Dashboard
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();

module.exports = {
  devtool: 'eval-source-map',
  cache: true,
    /*eslint-disable*/ 
  context: path.join(__dirname, 'src'),
  entry: {
    // dynamically add by server.js
  },
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: '[name].bundle.js',
    publicPath: `${defaultContext}/_admin/`,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    sourceMapFilename: "[name].map"
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
      /*eslint-enable*/ 
    proxy: {
      '!(**/_admin/**|/_tmp/**|/**/_admin/|/_tmp/*/**)': {

        //target: 'http://localhost:8088',
        //target: 'https://localhost:9002',
        target: 'https://localhost:8079',
        //target:'https://172.26.132.3',
        secure: false
      }
    }
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: '"dev"',
    }),
    new DashboardPlugin(dashboard.setData),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|build/,
        use: ['react-hot-loader', 'babel-loader?cacheDirectory=true']
      }, {
        test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192'
      }
    ]
  }
};
