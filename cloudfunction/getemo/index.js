// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100
/*  参数表：
    {
      id: string            //如果是文章，则填写该字段
      openid: string        //如果是用户，则填写该字段

      type: 0/1            //0代表是用户要获得该数据，1代表是文章获得该数据，
    }
*/

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('传入参数：', event)

  var data = {}
  if (event.type == 0) { //用户获得，所以用openid
    // 先取出集合记录总数
    var countResult = await db.collection('emo_data').where({
      userOpenid: event.openid
    }).count()
    var total = countResult.total
    // 计算需分几次取
    var batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    var emos = []

    for (let i = 0; i < batchTimes; i++) {
      var res = await db.collection('emo_tion').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
        userOpenid: event.openid
      }).get()
      emos = emos.concat(res.data)
    }

    data.emos = emos
  } else if (event.type == 1) { //文章获得，所以用id
    // 先取出集合记录总数
    var countResult = await db.collection('interaction').where({
      flag: 'comment',
      articalID: event.id
    }).count()
    var total = countResult.total
    // 计算需分几次取
    var batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    var comments = []

    for (let i = 0; i < batchTimes; i++) {
      var res = await db.collection('interaction').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
        flag: 'comment',
        articalID: event.id
      }).get()
      comments = comments.concat(res.data)
    }

    data.comments = comments

  }


  return data

}
//返回值：

//以下三种不一定全都有，取决于参数的传入情况
// comments: [],
// likes: [],
// stores: [],