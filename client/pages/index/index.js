import {
  WxCloud,
  regeneratorRuntime,
} from '../../engine/index'

Page({
  data: {
    lines: [],
    lineId: '',
    canRender: false,
  },

  onLoad: async function () {
    wx.showLoading({ title: '加载中', mask: true })

    const lines = await WxCloud.callCloudFunc({ name: 'getLines' })
    lines.forEach(line => {
      line.crosslines = JSON.parse(line.crosslines)
    })

    this.setData({ lines, canRender: true })
    wx.hideLoading()
  },

  onClickItem: function (e) {
    const { lineId } = e.currentTarget.dataset.item
    wx.navigateTo({ url: `/pages/list/index?lineId=${lineId}` })
  },
})
