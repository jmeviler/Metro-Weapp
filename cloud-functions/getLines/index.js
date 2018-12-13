// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const lines = db.collection('lines')

// 云函数入口函数
exports.main = async () => {
  try {
    return await lines.limit(20).get()
  } catch (e) { // eslint-disable-next-line
    console.error(e)
    return {}
  }
}
