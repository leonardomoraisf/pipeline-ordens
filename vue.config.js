const { defineConfig } = require("@vue/cli-service");
const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  outputDir: '../../Blegon/dev_environment/core/public',

  indexPath: '../app/v1/Views/pipeline-kanban-ordens.blade.php',

  assetsDir: './vue/pipeline',

  publicPath: '/',

  transpileDependencies: true,
  lintOnSave: false,

  chainWebpack: config => {
    config.resolve.alias
      .set("@", path.resolve(__dirname, "./src"))
  },

  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },

  devServer: {
    proxy: 'http://localhost:8585/'
  },
});
