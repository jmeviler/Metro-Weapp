export default class Weixin {
  static _systemInfo

  static getSystemInfo = () => {
    if (!Weixin._systemInfo) {
      Weixin._systemInfo = wx.getSystemInfoSync()
    }

    return Weixin._systemInfo
  }

  static isAndroid = () => {
    return Weixin.getSystemInfo().system.indexOf('iOS') === -1
  }

  static isX = () => {
    return /iphone10|iphone x/i.test(wx.getSystemInfoSync().model)
  }

  static checkUpdate = () => {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (resp) => {
              if (resp.confirm) {
                updateManager.applyUpdate()
              }
            },
          })
        })
      }
    })
  }
}
