const ExtensionReloader = require('webpack-extension-reloader')

module.exports = {
  productionSourceMap: false,
  // runtimeCompiler: true,
  // integrity: true,
  configureWebpack: {
    plugins: [
      new ExtensionReloader()
    ],
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js',
      },
    },
    devtool: false
  },
  
}
