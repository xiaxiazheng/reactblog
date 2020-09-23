const chalk = require('chalk') // 用来在控制台按颜色打印
const readline = require('readline')
const axios = require('axios')
const fse = require('fs-extra')
const unzip = require('unzipper')
const globby = require('globby')
const shell = require('shelljs')
const cash = require('cash')
const cp = require('child_process')

const extraTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `)

function wrap(options) {
  const { color, bgColor, tagText } = options
  return (...args) => {
    const msg = args.join('')
    const tag = ''
    // console.log(
    //   format(
    //     chalk[bgColor].black(tagText) + (tag ? extraTag(tag) : ''),
    //     chalk[color](msg)
    //   )
    // )
    console.log(
      chalk[bgColor].black(tagText) + (tag ? extraTag(tag) : ''),
      chalk[color](msg)
    )

    return this
  }
}

function logger(msg) {
  console.log(chalk.white(msg))

  return this
}

// 常规的打印信息
logger.base = wrap({
  color: 'cyan',
  bgColor: 'bgBlue',
  tagText: ' BASE ',
  icon: '👉'
})
logger.normal = wrap({
  color: 'gray',
  bgColor: 'bgBlue',
  tagText: ' NORMAL '
})
logger.primary = wrap({
  color: 'cyanBright',
  bgColor: 'bgBlue',
  tagText: ' Primary ',
  icon: '✨'
})

// 打印信息
logger.info = wrap({
  color: 'blue',
  bgColor: 'bgBlue',
  tagText: '  INFO  ',
  icon: '🎉'
})
// 任务成功
logger.success = wrap({
  color: 'green',
  bgColor: 'bgGreen',
  tagText: ' SUCCESS ',
  icon: '✅'
})
// 警告信息
logger.warn = wrap({
  color: 'yellow',
  bgColor: 'bgYellow',
  tagText: '  WARN  ',
  icon: '⚠️'
})
// 任务出错
logger.error = wrap({
  color: 'red',
  bgColor: 'bgRed',
  tagText: '  ERROR  ',
  icon: '❌'
})
// 任务完成
logger.done = wrap({
  color: 'green',
  bgColor: 'bgGreen',
  tagText: ' DONE ',
  icon: '🚀'
})
// 任务等待中
logger.waiting = wrap({
  color: 'yellow',
  bgColor: 'bgYellow',
  tagText: ' WAITING ',
  icon: '⚙️'
})

// 专门用于打印链接
logger.link = wrap({
  color: 'blue',
  bgColor: 'bgBlue',
  tagText: ' LINK '
})

function clearConsole(title) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}

function execSync(cmd, options = {}) {
  return cp
    .execSync(cmd, options)
    .toString()
    .trim()
}

function shellExec(cmd, options = { exitIfError: true }) {
  logger.waiting(`正在执行命令: `, cmd)
  if (shell.exec(cmd, options).code !== 0) {
    logger.error(`执行命令失败: `, cmd)
    if (options.exitIfError) {
      logger.error(`执行命令失败: `, cmd, ` 不会再继续向下运行`)
      shell.exit(1)
    }
  }
  logger.success(`执行命令成功: `, cmd)
}

module.exports = {
  chalk,
  logger,
  log: logger,
  clearConsole,
  axios,
  fse,
  unzip,
  globby,
  shell,
  execSync,
  shellExec
}