import Engine from '../Engine'
import I18N from './I18N'

const originalPage = Page // 保存原来的Page

Page = function (config) {
  const { onReady } = config
  config.onReady = function (options) {
    if (onReady) {
      onReady.call(this, options)
    }

    if (config.onShareAppMessage) {
      wx.showShareMenu({ withShareTicket: true })
    }

    const i18n = I18N.getI18NRes(this.route)
    this.setData({ i18n })
  }

  if (config.onLoad) {
    const { onLoad } = config
    config.onLoad = function (options) {
      if (Page.checkAuthPromise) {
        Page.checkAuthPromise.then(() => {
          onLoad.call(this, options)
        })
      } else {
        onLoad.call(this, options)
      }
    }
  }

  if (config.onShareAppMessage) {
    const { onShareAppMessage } = config
    config.onShareAppMessage = function (options) {
      const {
        path,
        title,
        query = {},
        imageUrl,
      } = onShareAppMessage.call(this, options)

      query.inviterOpenId = Engine.getOpenId()
      query.inviterName = Engine.getNickName()

      const queryString = Engine.formatQuery(query)
      return { title, imageUrl, path: `${path}?${queryString}` }
    }
  }

  return originalPage(config)
}

Page.checkAuthPromise = null

export default Page

const originComponent = Component
Component = function (config) {
  const { attached } = config
  config.attached = function () {
    const i18n = I18N.getI18NRes(this.is)
    this.setData({ i18n })

    if (attached) {
      attached.call(this)
    }
  }

  return originComponent(config)
}
