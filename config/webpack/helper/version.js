const path = require('path')
const chalk = require('chalk')
const {
  printBox,
  checkCliVersion: _checkCliVersion,
  checkTemplateVersion: _checkTemplateVersion,
  checkUIVersion: _checkUIVersion
} = require('@gem-mine/sapphire-helper')
const { ROOT, GEM_MINE_DOC, GEM_MINE_DOC_VERSION, UI_DOC } = require('../constant')
const { getConfig } = require('./util')

function getLocalVersionTip(localVersion) {
  let local = ''
  if (localVersion) {
    local = `${chalk.gray(localVersion)} → `
  }
  return local
}

function checkCliVersion() {
  let message
  const { localVersion, remoteVersion } = _checkCliVersion()
  if (localVersion) {
    if (remoteVersion && localVersion !== remoteVersion) {
      message = `sapphire 发现新版本 ${chalk.gray(localVersion)} → ${chalk.yellow(
        remoteVersion
      )}，版本履历：${chalk.green(GEM_MINE_DOC_VERSION)}
请执行 ${chalk.yellow('npm i -g @gem-mine/sapphire')} 进行更新`
    }
  } else {
    message = `sapphire 未安装，帮助文档：${chalk.green(GEM_MINE_DOC)}
请执行 ${chalk.yellow('npm i -g @gem-mine/sapphire')} 进行安装`
  }
  return message
}

async function checkTemplateVersion(context) {
  let message
  const { localVersion, remoteVersion } = await _checkTemplateVersion(context)
  if (remoteVersion && localVersion !== remoteVersion) {
    message = `工程代码骨架 发现新版本 ${getLocalVersionTip(localVersion)}${chalk.yellow(
      remoteVersion
    )}，版本履历：${chalk.green(`${GEM_MINE_DOC_VERSION}`)}`
  }
  return message
}

function checkUIVersion(context) {
  let message
  const { ui } = context
  if (ui) {
    const { localVersion, remoteVersion } = _checkUIVersion(context)
    if (remoteVersion && localVersion !== remoteVersion) {
      const link = UI_DOC[ui]
      let doc
      if (link) {
        doc = `，版本履历：${chalk.green(`${link}`)}`
      }
      message = `UI库(${ui}) 发现新版本 ${getLocalVersionTip(localVersion)}${chalk.yellow(remoteVersion)}${doc}`
    }
  }
  return message
}

module.exports = async function () {
  const context = getConfig(path.join(ROOT, '.sapphire'))
  const prefix = '🚀 '
  let message = ''
  const cliMessage = checkCliVersion()
  if (cliMessage) {
    message += `${prefix}${cliMessage}`
  }

  const templateInfo = await checkTemplateVersion(context)
  const uiInfo = checkUIVersion(context)
  if (templateInfo || uiInfo) {
    if (cliMessage) {
      message += '\n\n\n'
    }
    if (templateInfo) {
      message += `${prefix}${templateInfo}\n`
    }
    if (uiInfo) {
      message += `${prefix}${uiInfo}\n`
    }
    message += `建议执行 ${chalk.yellow('sapphire update')} 进行更新`
  }

  if (message) {
    printBox({ text: message })
  }
}
