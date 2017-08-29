const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: false,
  context: path.join(__dirname, 'src'),// eslint-disable-line
  entry: {
    main: [
      './styles/index.less',
      './index'
    ],
  },
  output: {
  //    path: path.join(__dirname, 'build/static'),
  //    filename: '[name].bundle.js',
  //	publicPath: '/fivestaradminstorefront/_admin/static/'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
	new webpack.optimize.DedupePlugin(),
	new ExtractTextPlugin({filename: 'styles.css'}),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      ENV: '"dist"',
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({fallback:'style-loader', use: ['css-loader', 'less-loader']})
      },  {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192'
      }
    ]
  }
};
