// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
/*
//文章或视频的记录id
 */

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection(event.collection).doc(event._id).update({
    data: {
      viwerNum: _.inc(1)
    }
  })
}