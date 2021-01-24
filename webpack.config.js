const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", path.resolve(__dirname, "./src/index.js")],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  devtool: "source-map",
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "bundle.js",
  },

  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
    hot: true,
  },
};
