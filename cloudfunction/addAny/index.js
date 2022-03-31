// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("传入参数：", event)
  const wxContext = cloud.getWXContext()
  try {
    if(event.openid) event.mydata.openid = wxContext.OPENID;
    return await db.collection(event.jihe).add({
      // data 字段表示需新增的 JSON 数据
      data: event.mydata
    })
  } catch (e) {
    console.error(e)
  }
}