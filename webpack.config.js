const path = require('path')

module.exports = {
  entry: './example/src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: './example',
    historyApiFallback: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'magik-react-hooks': path.resolve(__dirname, 'src'),
    },
  },
}
