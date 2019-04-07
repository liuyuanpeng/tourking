const { log } = require('@gem-mine/sapphire-helper')
const { wdsProxySetting } = require('@gem-mine/request')
const anyBody = require('body/any')
const { getIP } = require('./util')

const proxy = require('../../proxy')
const { BUILD } = require('../constant')

module.exports = function (hot, port, params = {}) {
  const obj = {
    contentBase: BUILD,
    watchContentBase: true,
    host: getIP(),
    port: port,
    overlay: true,
    stats: {
      chunks: false,
      children: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      errors: true,
      warnings: false
    },
    proxy: wdsProxySetting(proxy, {
      onProxyReq: function (proxyReq, req, res) {
        const method = req.method.toUpperCase()
        const message = `${method}: http://${req.headers.host}${req.originalUrl} -> ${this.url}${req.url}`
        req.headers['content-type'] = 'application/json'
        log.warning(`收到请求 ${message}`)
        console.log('header:', JSON.stringify(req.headers))
        anyBody(req, res, function (err, body) {
          if (['POST', 'PUT', 'DELETE'].indexOf(method) > -1) {
            if (err) {
              console.log(err)
            } else {
              console.log('body:', JSON.stringify(body))
            }
          }
        })
      }
    })
  }
  if (hot) {
    obj.inline = true
    obj.hot = true
  }
  return Object.assign(obj, params)
}
