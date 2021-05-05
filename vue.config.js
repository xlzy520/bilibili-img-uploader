const ExtensionReloader = require('webpack-extension-reloader')

module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  integrity: true,
  configureWebpack: {
    plugins: [
      new ExtensionReloader({
        port: 9900
      })
    ],
    resolve: {
      alias: {
        // vue$: 'vue/dist/vue.runtime.esm.js',
        // vue: 'vue/dist/vue.runtime.esm.js',
      },
    },
    devtool: false
  },
  
}
