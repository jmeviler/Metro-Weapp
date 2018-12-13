import {
  WxCloud,
  regeneratorRuntime,
} from '../../engine/index'

Page({
  data: {
    cLng: '',
    cLat: '',
    distance: 0,
    duration: 0,
    steps: [],
    markers: [],
    polyline: [],
    showModal: '',
    canWalk: '',
  },

  onLoad: async function (options) {
    wx.showLoading({ title: '加载中', mask: true })

    const { location, current, name } = options
    const [cLng, cLat] = current.split(',')
    const [longitude, latitude] = location.split(',')
    const marker = { id: 1, longitude, latitude, title: name }
    const { distance, duration, polyline, steps } = await WxCloud.callCloudFunc({
      name: 'getRoutePlan',
      data: {
        type: 'walking',
        from: `${cLat},${cLng}`,
        to: `${latitude},${longitude}`,
      },
    })

    this.setData({
      cLng, cLat, polyline,
      distance, duration, steps,
      canWalk: distance < 4500,
      markers: [marker],
    })
    wx.hideLoading()
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  onShowModal: function () {
    this.setData({ showModal: !this.data.showModal })
  },

  onHideModal: function () {
    this.setData({ showModal: false })
  },
})
