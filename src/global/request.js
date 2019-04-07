/* global ENV, DEBUG */
import request from '@gem-mine/request'
import proxyConfig from 'config/proxy'

// 获取环境中对应的网络配置
request.init(proxyConfig, {
  env: ENV,
  wds: DEBUG
})

// 全局设置，对所有请求生效
request.config({
  verify: function (data) {
    return data.status === 200
  },
  loading: function () {
    console.log('loading...')
  },
  error: function (res) {
    console.log('error', res)
  },
  complete: function (res) {
    console.log('complete')
  }
})

// 某个域的设置，会覆盖全局设置，仅对当前域生效
// request.api.config({
// })
