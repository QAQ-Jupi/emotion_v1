// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/*  参数表：
   
    'userOpenid': app.globalData.openid,
    'imgPath': img_fileID,
    'emotion': that.data.emotion
}
*/

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("传入参数：", event)
  try {
    return await db.collection('emo_data').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        userOpenid: event.userOpenid,
        _openid:event.userOpenid,
        imgPath: event.imgPath,
        emotion: event.emotion,
        time: event.time,
        label : event.label,
        detail: event.detail,
        mode :event.mode,
      }
    })
  } catch (e) {
    console.error(e)
  }

}