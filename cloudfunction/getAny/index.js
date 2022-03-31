// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('传入参数：', event)
  var res = await db.collection(event.jihe).where(event.mywhere).get()
  return res.data
}