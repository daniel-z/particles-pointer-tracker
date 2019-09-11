const CopyPlugin = require('copy-webpack-plugin');
const distFolderPath = __dirname + '/dist';
distFileName = 'particles-pointer-tracker.js';
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: distFolderPath,
    publicPath: '/',
    filename: distFileName
  },
  plugins: [new CopyPlugin([
      {
        from: `${distFolderPath}/${distFileName}`,
        to: '../demo/public'
      }
    ])]
};