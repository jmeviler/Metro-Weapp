import {
  Enums,
  regeneratorRuntime,
  Engine,
} from '../../engine/index'

Page({
  data: {
    tabs: ['站点查询', '附近站点'],
    stv: {
      windowWidth: 0,
      offset: 0,
      tStart: false,
    },
    activeTab: 0,
    hasLocation: false,
    pois: [],
    inputShowed: false,
    inputVal: '',
    matches: [],
    history: [],
  },

  onLoad: function () {
    const { stv, tabs, activeTab } = this.data
    this.tabsCount = tabs.length
    const { windowWidth } = wx.getSystemInfoSync()
    this.initTabPostion(activeTab, this.data.stv)

    this.setData({ stv: { ...stv, windowWidth } })
  },

  onHide: function () {
    this.onHideInput()
  },

  onShow: function () {
    this.setData({ history: Engine.getStorage('history') })
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

  onShowInput: function () {
    this.setData({ inputShowed: true })
  },

  onHideInput: function () {
    this.setData({
      matches: [],
      inputVal: '',
      inputShowed: false,
    })
  },

  onClearInput: function () {
    this.setData({ inputVal: '', matches: [] })
  },

  onSubmit: function (e) {
    wx.navigateTo({ url: `/pages/detail/index?name=${e.detail.value}` })
  },

  onChangeName: function (e) {
    this.setData({
      inputVal: e.detail.value,
      matches: this.checkName(e.detail.value),
    })
  },

  onDeleteHistoryItem: function (e) {
    const { history } = this.data
    const index = history.findIndex(i => i === e.currentTarget.dataset.item)
    history.splice(index, 1)

    Engine.setStorage('history', [])
    this.setData({ history })
  },

  onDeleteHistory: function () {
    Engine.setStorage('history', [])
    this.setData({ history: [] })
  },

  checkName: function (key) {
    if (!key.length) return []
    return Enums.NAMES.filter(item => !item.indexOf(key) && item !== key)
  },
})
