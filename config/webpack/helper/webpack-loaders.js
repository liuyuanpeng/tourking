const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { join } = require('./util')
const { getPublicPath } = require('./source-path')
const config = require('../../webpack')
const { NODE_MODULES, STYLE, CONFIG } = require('../constant')

const publicPath = getPublicPath(config)

const styleLoaders = {
  // style loader，仅在 hot 模式下使用
  style: {
    loader: 'style-loader'
  },
  // 抽取 loader，非 hot 模式下使用
  extract: {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath
    }
  },
  // css loader， 没有 module 处理，对 excludes 规则生效
  css: {
    loader: 'css-loader'
  },
  // css loader with module，非 excludes 规则下生效
  cssWithModule: {
    loader: 'css-loader',
    options: {
      modules: true,
      importLoaders: 1,
      localIdentName: '[name]__[local]-[hash:base64:5]'
    }
  },

  // postcss loader config
  postcss: {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      config: {
        path: path.resolve(CONFIG, 'webpack')
      }
    }
  },

  // sass loader config
  sass: {
    loader: 'sass-loader',
    options: {
      outputStyle: 'expand',
      sourceMap: true
    }
  },

  // less loader config
  less: {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true,
      sourceMap: true
    }
  }
}

function loadStyle(reg, hot, exclude, loader) {
  const excludes = join(NODE_MODULES, STYLE, exclude)
  const loaders = []
  loaders.push(hot ? styleLoaders.style : styleLoaders.extract)
  const result = [
    {
      test: reg,
      exclude: excludes,
      use: loaders.concat(styleLoaders.cssWithModule, styleLoaders.postcss)
    },
    {
      test: reg,
      include: excludes,
      use: loaders.concat(styleLoaders.css, styleLoaders.postcss)
    }
  ]

  if (loader) {
    result.forEach(item => {
      item.use.push(loader)
    })
  }

  return result
}

module.exports = {
  babel: function (hot) {
    const obj = {
      test: /\.jsx?$/,
      exclude: NODE_MODULES
    }
    if (hot) {
      obj.use = ['cache-loader', 'babel-loader?cacheDirectory=true']
    } else {
      obj.use = ['babel-loader']
    }
    return obj
  },
  css: function (hot, exclude) {
    return loadStyle(/\.css$/, hot, exclude)
  },
  less: function (hot, exclude) {
    return loadStyle(/\.less$/, hot, exclude, styleLoaders.less)
  },
  sass: function (hot, exclude) {
    return loadStyle(/\.scss$/, hot, exclude, styleLoaders.sass)
  },
  source: function () {
    return [
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?name=[name]-[hash].[ext]&limit=10240'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      }
    ]
  }
}
