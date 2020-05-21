interface ITrackType {
  env: string
  trackUrl: string
  commonData: object
  silence: boolean
}

class Track {
  // 浏览器指纹
  public uuid = ''

  // 当前环境
  public env = ''

  // 用于上报的路径
  public trackUrl = ''

  // 该项目埋点的基本数据
  public commonData = {}

  // 是否不上报
  public silence = false

  constructor(options: ITrackType) {
    this.env = options.env
    this.trackUrl = options.trackUrl
    this.commonData = options.commonData
    this.silence = options.silence || false
  }

  // 发起发送请求
  public request (data: object) {
    this.silence && console.log('不上报哟')
    console.log('send data', data)
  }

  // 手动埋点
  public send(toSendData: object) {
    const url = this.trackUrl
    const data = { ...this.commonData, ...toSendData }
    return this.$nextTick(() => {
      this.request({ data, url })
    })
  }

  // 异步，将来可兼容 Promise
  public $nextTick(callback: Function, timeout: number = 4) {
    return setTimeout(callback, timeout)
  }
}

export default Track