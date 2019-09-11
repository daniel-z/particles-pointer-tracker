const CopyPlugin = require('copy-webpack-plugin');
const distFolderPath = __dirname + '/dist';
entryFileName = 'particles-pointer-tracker.js';
distFileName = entryFileName;

module.exports = {
  mode: 'production',
  entry: `./src/${entryFileName}`,
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
    extensions: ['.js']
  },
  output: {
    path: distFolderPath,
    publicPath: '/',
    filename: `${distFileName}`
  },
  plugins: [new CopyPlugin([
      {
        from: `${distFolderPath}/${distFileName}`,
        to: '../demo/src/dist'
      }
    ])]
};