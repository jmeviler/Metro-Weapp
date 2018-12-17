import {
  Enums, Engine, Weixin,
} from '../../engine/index'

import DETAILS from '../../data/stations'
import EXITS from '../../data/exits'

Page({
  data: {
    details: [],
    exit: [],
    lines: [],
    lineColors: [],
    fltimes: [],
    barrierInfo: [],
    name: '',
    nameEn: '',
    imgUrl: '',
    tabs: ['首末班车', '站点信息', '平面图'],
    stv: {
      windowWidth: 0,
      offset: 0,
      tStart: false,
    },
    activeTab: 0,
    longitude: '',
    latitude: '',
  },

  onLoad: function (options) {
    const { name } = options
    const { tabs, stv, activeTab, lines } = this.data
    let { nameEn, fltimes } = this.data
    const { exit, imgUrl, location, barrierfreeinfo } = EXITS[name]

    const details = DETAILS[name]
    this.tabsCount = tabs.length
    const { windowWidth } = Weixin.getSystemInfo()
    this.initTabPostion(activeTab, this.data.stv)

    details.forEach(item => {
      lines.push(item.line)
      fltimes = [...fltimes, ...item.fltime]
      if (!nameEn) {
        nameEn = item.name_en
      }
    })

    this.setData({
      exit, name, nameEn, lines,
      fltimes, details, location,
      imgUrl: imgUrl || '',
      barrierInfo: this.formatBarrier(barrierfreeinfo),
      tabs: imgUrl ? tabs : tabs.splice(0, 2),
      lineColors: Enums.LINE_COLORS,
      stv: { ...stv, windowWidth },
    })

    wx.setNavigationBarTitle({ title: name })
    this.updateHistory(name)
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('hideMap')
  },

  initTabPostion: function (tabIndex = 0, stv = {}) {
    this.setData({
      activeTab: tabIndex,
      stv: {
        ...stv,
        offset: stv.windowWidth * tabIndex,
      },
    })
  },

  onClickTab(e) {
    const { index } = e.currentTarget.dataset
    this.initTabPostion(index, this.data.stv)
  },

  onClickPreview: function () {
    wx.previewImage({ urls: [this.data.imgUrl] })
  },

  formatBarrier: function (info = '') {
    if (!info) return []
    return info[0].split('\n')
  },

  updateHistory: function (name = '') {
    const history = Engine.getStorage('history') || []
    if (!history.includes(name)) {
      if (history.length >= 8) {
        history.splice(history.length - 1, 1)
      }
      history.unshift(name)
    }

    Engine.setStorage('history', history)
  },

  goToMap: function () {
    const { location, name, longitude, latitude } = this.data
    const current = `${longitude},${latitude}`
    const query = Engine.formatQuery({ location, current, name })
    wx.navigateTo({ url: `/pages/map/index?${query}` })
  },
})
