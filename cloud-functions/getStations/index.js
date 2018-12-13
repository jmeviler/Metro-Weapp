// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const lines = db.collection('lines')

// 云函数入口函数
exports.main = async (event) => {
  try {
    return await lines.where({ lineId: event.lineId }).get()
  } catch (e) { // eslint-disable-next-line
    console.error(e)
    return {}
  }
}
