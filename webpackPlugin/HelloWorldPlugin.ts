// class HelloWorldPlugin {
//   apply(compiler) {
//     // compiler.hooks.done.tap('Hello World Plugin', (stats) => {
//     //   console.log('Hello World', stats)
//     // })
//     compiler.plugin('done', (stats) => {
//       console.log('Hello World', stats)
//     })
//   }
// }

function HelloWorldPlugin(options) {

}

HelloWorldPlugin.prototype.apply = function(compiler) {
  compiler.hooks.compilation.tap('Hello World Plugin', (compilation) => {
    console.log('Hello World', compilation)
  })
}

module.exports = HelloWorldPlugin