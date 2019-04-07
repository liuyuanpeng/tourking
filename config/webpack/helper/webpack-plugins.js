const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WebpackMd5Hash = require('webpack-md5-hash')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const DonePlugin = require('../plugins/done')
const config = require('../../webpack')
const { ROOT, BUILD, PUBLIC } = require('../constant')
const { getPublicPath } = require('./source-path')
const detectVerion = require('./version')

const publicPath = getPublicPath(config)

module.exports = {
  define: function (env, params = {}) {
    const obj = {
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      },
      ENV: JSON.stringify(process.env.npm_config_env) // 命令运行 --env=xxx
    }
    return new webpack.DefinePlugin(Object.assign(obj, params))
  },
  ignore: function (rule) {
    return new webpack.IgnorePlugin(rule)
  },
  scopeHosting: function () {
    return new webpack.optimize.ModuleConcatenationPlugin()
  },
  hot: function () {
    return new webpack.HotModuleReplacementPlugin()
  },
  splitCss: function () {
    return new CSSSplitWebpackPlugin({ size: 4000 })
  },
  html: function (params = {}) {
    const obj = Object.assign(
      {
        template: path.resolve(PUBLIC, 'index.html'),
        filename: 'index.html',
        inject: false,
        showErrors: true,
        title: config.title,
        staticHash: config.staticHash,
        prefix: publicPath
      },
      params
    )
    if (params.minify === true) {
      obj.minify = {
        removeComments: true,
        collapseWhitespace: true
      }
    }
    return new HtmlWebpackPlugin(obj)
  },
  dll: function (params = {}) {
    return new webpack.DllPlugin(
      Object.assign(
        {
          path: path.resolve(ROOT, 'manifest.json'),
          name: '[name]',
          context: ROOT
        },
        params
      )
    )
  },
  dllReference: function (params = {}) {
    return new webpack.DllReferencePlugin(
      Object.assign(
        {
          context: ROOT,
          manifest: require(path.resolve(ROOT, 'manifest.json'))
        },
        params
      )
    )
  },
  browser: function (url) {
    return new OpenBrowserPlugin({ url })
  },
  extractCss: function () {
    return new MiniCssExtractPlugin({
      filename: `[name]${config.staticHash ? '.[contenthash]' : ''}.css`
    })
  },
  analyzer: function () {
    return new BundleAnalyzerPlugin()
  },
  md5hash: function () {
    return new WebpackMd5Hash()
  },
  extraWatch: function () {
    return new ExtraWatchWebpackPlugin(
      config.extraWatch || {
        dirs: [],
        files: []
      }
    )
  },
  done: (function (runDetectVersion) {
    return function (callback, runCommonTask, debug = false) {
      return new DonePlugin(function () {
        if (runCommonTask) {
          if (config.additional) {
            config.additional.forEach(function (name) {
              fs.copySync(`${PUBLIC}/${name}`, `${BUILD}/${name}`)
            })
          }
          const fav = 'favicon.ico'
          if (fs.existsSync(path.resolve(PUBLIC, fav))) {
            fs.copySync(`${PUBLIC}/${fav}`, `${BUILD}/${fav}`)
          }
          if (config.done) {
            config.done(exports, config)
          }
          if (debug && runDetectVersion) {
            runDetectVersion = false
            // 检测 sapphire、sapphire-template、ui 库 是否需要更新
            detectVerion()
          }
        }
        if (callback) {
          callback(exports, config)
        }
      })
    }
  })(true)
}
