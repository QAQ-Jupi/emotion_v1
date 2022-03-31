// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/*  参数表：
    "openid":
    "phoneNum": "",                      //手机号
     avatarUrl:   //头像
*/

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('传入参数：', event)
  return await db.collection('user_data').where({
    openid: event.openid
  }).update({
      data:{
        phoneNum:event.phoneNum,
        name:event.name,
        avatarUrl:event.avatarUrl
      }
    }).then(function(res) {
      return '修改成功'
    }).catch(function(err) {
      return '修改失败'
    })
}