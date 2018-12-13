/* eslint-disable max-len */
// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const { from, to, type } = event
  const key = process.env.MAP_KEY

  const { data } = await axios.get(`https://apis.map.qq.com/ws/direction/v1/${type}/?from=${from}&to=${to}&key=${key}`)
  const [route] = data.result.routes
  const coors = route.polyline
  const pl = []
  // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
  const kr = 1000000
  for (let i = 2; i < coors.length; i++) {
    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
  }
  // 将解压后的坐标放入点串数组pl中
  for (let i = 0; i < coors.length; i += 2) {
    pl.push({ latitude: coors[i], longitude: coors[i + 1] })
  }

  route.polyline = [{ points: pl, color: '#FF0000DD', width: 2 }]
  return { data: route }
}
