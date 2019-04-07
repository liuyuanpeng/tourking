const path = require('path')
const { BUILD } = require('./constant')
const { helper, copyFileToDist, join } = require('./helper')
const cfg = require('../webpack')

const isDev = process.env.isDev === 'true'

/**
 * 构建 vendor 包，将一些公用模块打包
 */
const config = {
  mode: isDev ? 'development' : 'production',
  entry: {
    vendor: ['react', 'react-dom', 'prop-types', 'create-react-class', '@gem-mine/durex', '@gem-mine/request', '@gem-mine/immutable'].concat(cfg.vendor)
  },
  output: helper.output.lib(),
  resolve: helper.resolve(),
  resolveLoader: helper.resolveLoader(),
  module: {
    rules: [helper.loaders.babel()]
  },
  plugins: join(
    helper.plugins.define(isDev ? 'dev' : 'production'),
    helper.plugins.dll(),
    helper.plugins.done(function () {
      copyFileToDist(path.resolve(BUILD, 'vendor.js'), BUILD, true, cfg.staticHash)
    })
  )
}

module.exports = config
