module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  resolve:{
    modules: ['node_modules', './src']
  },
  module: {
    rules:[
      {
        test: /\.(scss|css)$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use:[
          { loader: 'file-loader?name=[name].[ext]&outputPath=css/fonts/&publicPath=/' }
        ]
      }
    ]
  }
}
