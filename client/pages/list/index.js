import {
  WxCloud,
  regeneratorRuntime,
} from '../../engine/index'

Page({
  data: {
    lineColor: '',
    stations: [],
    selected: '',
  },

  onLoad: async function (options) {
    wx.showLoading({ title: '加载中', mask: true })

    const [line] = await WxCloud.callCloudFunc({
      name: 'getStations',
      data: { lineId: options.lineId },
    })

    const { color, station, lineName } = line
    this.setData({
      lineColor: color,
      stations: JSON.parse(station),
    })

    wx.setNavigationBarTitle({ title: lineName })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: `#${color}`,
      animation: {
        duration: 350,
        timingFunc: 'easeIn',
      },
    })

    wx.hideLoading()
  },

  onClickName: async function (e) {
    const { n } = e.currentTarget.dataset.item
    wx.navigateTo({ url: `/pages/detail/index?name=${n}` })
  },
})
