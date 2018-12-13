/* eslint-disable no-console */

import Engine from '../Engine'
import Extensions from './Extensions'
import I18n from './I18N'

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

const lastRequestTaskMarkedAbort = {}

export default class Rest {
  static get = (url, params) => Rest.request(Method.GET, url, params)
  static post = (url, params) => Rest.request(Method.POST, url, params)
  static put = (url, params) => Rest.request(Method.PUT, url, params)
  static delete = (url, params) => Rest.request(Method.DELETE, url, params)

  static formatParams = (url, method, data) => {
    if (method !== Method.GET) {
      return url
    }

    const arrayParams = []
    for (const key in data) {
      if (Extensions.isArray(data[key]) && data[key].length) {
        arrayParams.push(`${key}=${data[key].join(',')}`)
        delete data[key]
      }
    }

    if (arrayParams.length) {
      return `${url}?${arrayParams.join('&')}`
    }

    return url
  }

  static request = (method, url, data = {}) => {
    const { ignoreLoading = false, showToast, requestName = '' } = data
    delete data.requestName
    delete data.ignoreLoading
    delete data.showToast
    let formatedUrl = Rest.formatParams(url, method, data)
    if (!ignoreLoading) {
      wx.showLoading({
        mask: true,
        title: I18n.i18n('globalMessage', 'loading'),
      })
    }

    return new Promise((resolve, reject) => {
      if (!/https/.test(formatedUrl)) {
        formatedUrl = `${Engine.getEndPoint()}/v2${formatedUrl}`
      }

      if (requestName && lastRequestTaskMarkedAbort[requestName]) {
        lastRequestTaskMarkedAbort[requestName].abort()
      }

      const requestTask = wx.request({
        url: formatedUrl,
        data,
        header: Rest.getHeader(),
        method,
        success: function (response) {
          Rest.onHandleResponse({ url, method, data }, response, resolve, reject)
        },
        fail: function (res) {
          switch (res.errMsg) {
            case 'request:fail abort':
              res.isAbort = true
              break
            case 'request:fail 请求超时。':
            case 'request:fail timeout':
            case 'request:fail 似乎已断开与互联网的连接。':
            case 'request:fail The Internet connection appears to be offline.':
              res.isTimeOut = true

              if (showToast) {
                wx.showToast({
                  title: '连接超时',
                  icon: 'none',
                  duration: 2000,
                })
              }

              break
            default:
              break
          }

          reject(res)
        },
        complete: function () {
          if (!ignoreLoading) {
            wx.hideLoading()
          }
        },
      })

      if (requestName) {
        lastRequestTaskMarkedAbort[requestName] = requestTask
      }
    })
  }

  static mockRequest = (method, url, params) => {
    return {
      returns: (result) => {
        console.warn('mock method', method, url)
        console.warn('mock request params', params)
        console.warn('mock response result', result)

        return result
      },
    }
  }

  static mock = {
    get: (url, params) => Rest.mockRequest(Method.GET, url, params),
    post: (url, params) => Rest.mockRequest(Method.POST, url, params),
    delete: (url, params) => Rest.mockRequest(Method.DELETE, url, params),
    put: (url, params) => Rest.mockRequest(Method.PUT, url, params),
  }

  static setCookie = (cookie) => {
    Rest._cookie = cookie
    Engine.setStorage('cookie', cookie)
  }

  static getCookie = () => {
    if (!Rest._cookie) {
      return Engine.getStorage('cookie')
    }

    return Rest._cookie
  }

  static onHandleResponse = (request, response, resolve, reject) => {
    if (response.statusCode < 400) {
      if (response.header['Set-Cookie']) {
        Rest.setCookie(response.header['Set-Cookie'])
      }

      resolve(response.data)
      return
    }

    switch (response.statusCode) {
      case 401:
        Engine.relogin()
        break
      case 500:
      case 502:
      case 503:
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 2000,
        })
        break
      default:
        break
    }
    reject({ request, response })

    console.error({ request, response })
  }

  static getHeader = () => {
    const header = {
      'x-account-id': Engine.getAccountId(),
      'x-access-token': Engine.getAccessToken(),
    }

    if (Rest.getCookie()) {
      header.cookie = Rest.getCookie()
    }

    return header
  }
}
