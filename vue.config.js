const { defineConfig } = require("@vue/cli-service");
const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  outputDir: '../../public',

  indexPath: '../app/v1/Views/pipeline-kanban-ordens.blade.php',

  assetsDir: './vue/pipeline',

  publicPath: '/',

  transpileDependencies: true,
  lintOnSave: false,

  chainWebpack: config => {
    config.plugin("html").tap((args) => {
      args[0].title = "SIMPLLIS - PIPELINE";
      return args;
    });

    config.resolve.alias
      .set("@", path.resolve(__dirname, "./src"))
  },

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },

    plugins: [
      new NodePolyfillPlugin()
    ]
  },

  devServer: {
    proxy: 'http://localhost:8585/'
  },
});
