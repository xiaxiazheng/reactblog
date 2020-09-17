const path = require('path');
const HelloWorldPlugin = require('./webpackPlugin/HelloWorldPlugin.ts')
const cp = require('child_process')
const axios = require('axios')

// 获取本机IP
function getIp() {
  const address = require('address')
  const IPv4 = address.ip() || 'localhost'
  console.log('IPv4: ', IPv4)
  return IPv4
}

const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  fixBabelImports,
  addWebpackPlugin
} = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

function execSync(cmd, options = {}) {
  return cp.execSync(cmd, options).toString().trim()
}

function formatDate(str) {
  const date = str ? new Date(str) : new Date()
  function padStart(num) {
    return num < 10 ? `0${num}` : `${num}`
  }

  const year = date.getFullYear()
  const month = padStart(date.getMonth() + 1)
  const day = padStart(date.getDate())

  const hour = padStart(date.getHours())
  const minute = padStart(date.getMinutes())
  const second = padStart(date.getSeconds())

  const timeStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  return timeStr
}

const baseOpt = {
  // cwd: '../',
  encoding: 'utf-8'
}

function getNetworkTime() {
  return new Promise((resolve, reject) => {
    axios
      .get('http://baidu.com')
      .then((res) => {
        const { headers } = res
        const { date } = headers
        const networkTime = formatDate(new Date(date))
        resolve(networkTime)
      })
      .catch((err) => {
        // console.log(`err: `, err)
        reject('null date')
      })
  })
}

function getOsInfo() {
  const os = require('os')

  function formatBytes(bytes) {
    const bytesUnits = ['B', 'kB', 'MB', 'GB', 'TB']
    let result = bytes
    let index = 0
    while (index < bytesUnits.length - 1 && result > 1024) {
      result /= 1024
      index++
    }
    return `${Math.round(result)}${bytesUnits[index]}`
  }
  const freemem = os.freemem()
  const totalmem = os.totalmem()
  function getCpuInfo() {
    try {
      const cpus = os.cpus()
      return {
        cpu: cpus[0].model,
        cpuLength: cpus.length
      }
    } catch (err) {
      console.log(`Get CPU info err: `, err)
    }
  }
  return {
    // 局域网ip
    ip: getIp(),
    os: {
      // 操作系统的主机名
      hostname: os.hostname(),
      os: `${os.type()} ${os.platform()} ${os.release()}`,
      memory: `${formatBytes(freemem)} / ${formatBytes(totalmem)}`,
      ...getCpuInfo()
    }
  }
}

async function getEnvInfo() {
  const envInfo = {
    buildTime: formatDate(new Date())
  }
  try {
    Object.assign(
      envInfo,
      {
        gitUsername: execSync(`git config user.name`, { ...baseOpt }),
        gitUserEmail: execSync(`git config user.email`, { ...baseOpt }),
        // git当前所处的分支
        gitCurrentBranch: execSync(`git rev-parse --abbrev-ref HEAD`, {
          ...baseOpt
        }),
        // git当前分支最近一次提交的commit id
        gitLastCommitId: execSync(`git rev-parse --short HEAD`, { ...baseOpt }),
        nodeVersion: execSync(`node -v`, { ...baseOpt }),
        npmVersion: execSync(`npm -v`, { ...baseOpt }),
        yarnVersion: execSync(`yarn -v`, { ...baseOpt })
      },
      getOsInfo()
    )
    const time = await getNetworkTime()
    envInfo.networkTime = time
  } catch (err) {
    console.log(`getEnvInfo err: `, err)
  }
  console.log(`envInfo: `, envInfo)
  return envInfo
}

// 找某个webpack plugin
function findPlugin(plugins, nameMatcher) {
  return plugins.find((plugin) => {
    return (
      plugin.constructor &&
      plugin.constructor.name &&
      nameMatcher(plugin.constructor.name)
    )
  })
}

async function handleHTMLPlugin(plugins) {
  const htmlPlugin = findPlugin(plugins, (name) =>
    /HtmlWebpackPlugin/i.test(name)
  )
  // 注入到页面的对象
  // const { getEnvInfo } = require('./env-info')
  const envInfo = await getEnvInfo()
  htmlPlugin.options.injectObj = JSON.stringify(envInfo)
  // console.log(`htmlPlugin: `, htmlPlugin)
}

module.exports = {
  webpack: function (config, env) {
    override(
      addWebpackExternals({
        'react': 'React',
        'react-dom': 'ReactDOM',
        'highlight.js': 'hljs',
        'quill': 'Quill',
      }),
      // addWebpackPlugin(
      //   new HelloWorldPlugin({ options: true })
      // ),
      // addWebpackPlugin(
      //   new BundleAnalyzerPlugin(),
      // ),
      // addWebpackPlugin(
      //   new CompressionPlugin()
      // ),
      addWebpackAlias({
        ['@']: path.resolve(__dirname, 'src')
        // ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, 'src/assets/antdIcon.ts')
      }),
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      })
    )(config, env)
    
    // 特别配置一下 HtmlWebpackPlugin，用于在页面注入数据
    handleHTMLPlugin(config.plugins)

    // 添加 react-hot-loader，用来支持模块热替换 HMR
    config = rewireReactHotLoader(config, env)
    return config
  }
}