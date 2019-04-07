const path = require('path')
const fs = require('fs-extra')
const { clean, copyFileToDist } = require('./file')
const { execWithProcess, readJSON, log } = require('@gem-mine/sapphire-helper')
const { join } = require('./util')
const { ROOT, BUILD } = require('../constant')

const output = require('./webpack-output')
const loaders = require('./webpack-loaders')
const plugins = require('./webpack-plugins')
const { resolve, resolveLoader } = require('./webpack-resolve')
const devServer = require('./webpack-devServer')

const { MODE } = process.env
const isDev = MODE === 'dev'

exports.preBuild = function () {
  let flag = true
  let files
  const prebuild = !!process.env.npm_config_prebuild
  const dist = path.resolve(BUILD, 'version.json')
  if (!prebuild && isDev) {
    if (fs.existsSync(dist) && fs.existsSync(`${ROOT}/manifest.json`)) {
      flag = false
    }
  }
  if (flag) {
    clean({ dist: BUILD })

    log.info('build polyfill && vendor')
    const env = Object.assign({}, process.env, {
      isDev
    })
    execWithProcess(`npm run polyfill`, { env })
    execWithProcess(`npm run vendor`, { env })
  }

  files = readJSON(dist)
  return files
}

exports.helper = {
  output,
  loaders,
  plugins,
  resolve,
  resolveLoader,
  devServer
}

exports.join = join
exports.copyFileToDist = copyFileToDist
