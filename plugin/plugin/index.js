
class plugin {
  constructor(options) {
    console.log('options', options)
  }
  apply(compiler) {
    compiler.hooks.emit.tap('customPlugin', function (compilation) {
      const files = {};
      for (const name of Object.keys(compilation.assets)) {
        files[name] = compilation.assets[name].size();
      }
      compilation.assets['custom.json'] = {
        source() {
          return JSON.stringify(files);
        }
      };
    })
  }
}

module.exports = plugin;