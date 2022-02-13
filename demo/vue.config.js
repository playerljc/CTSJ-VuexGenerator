const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [path.join(__dirname, 'node_modules'), 'node_modules']
    }
  }
}
