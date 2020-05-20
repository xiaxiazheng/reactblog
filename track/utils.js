// 判断当前环境支持哪一种埋点
exports.judgeSupport = function () {
  function getIsSupportImg() {
    try {
      const img = new Image()
      return true
    } catch (err) {
      console.log(`err: `, err)
      return false
    }
  }
  if (getIsSupportImg()) {
    return 'image'
  }

  function getIsSupportFetch() {
    if (typeof window.fetch === 'function') {
      return true
    }
    return false
  }
  if (getIsSupportFetch()) {
    return 'fetch'
  }

  function getIsSupportAjax() {
    if (window.XMLHttpRequest) {
      return true
    }
    return false
  }
  if (getIsSupportAjax()) {
    return 'ajax'
  }

  // 添加对通过beacon发送请求的支持
  function getIsSupportBeacon() {
    // @ts-ignore
    if (window.navigator.sendBeacon) {
      return true
    }
    return false
  }
  if (getIsSupportBeacon()) {
    return 'beacon'
  }
}