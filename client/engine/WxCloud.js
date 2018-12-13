import regeneratorRuntime from './utils/regeneratorRuntime'

export default class WxCloud {
  static callCloudFunc = async (data) => {
    try {
      const { result } = await wx.cloud.callFunction(data)
      return result ? result.data : null
    } catch (error) { // eslint-disable-next-line
      console.error(error)
      return {}
    }
  }

  static request = (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }
}
