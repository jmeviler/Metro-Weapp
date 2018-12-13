import './engine/utils/EnhancedPage'

import configs from './configs'
import { Engine, I18N } from './engine/index'

App({
  onLaunch: function (options = {}) {
    wx.cloud.init({ env: 'mrtro-dev-10086', traceUser: true })
    const params = options.query
    Engine.init({ configs })
    Engine.setEnv(params.env)
  },

  i18n: (...args) => {
    return I18N.i18n(...args)
  },
})
