// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100


// 云函数入口函数
exports.main = async(event, context) => {
  console.log('传入参数：', event)

  var data = {}
  var countResult = await db.collection('emo_data').where({
    userOpenid: event.openid
  }).count()
  var total = countResult.total
  data.total=total
  // 计算需分几次取
  var batchTimes = Math.ceil(total / 100)
 
  var emos = []

  for (let i = 0; i < batchTimes; i++) {
    var res = await db.collection('emo_data').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
      userOpenid: event.openid
    }).get()
    emos = emos.concat(res.data)
  }
  data.emos = emos
    // console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' ); 

  // } else if (event.type == 1) { //文章获得，所以用id
    // 先取出集合记录总数
  //   var countResult = await db.collection('interaction').where({
  //     flag: 'comment',
  //     articalID: event.id
  //   }).count()
  //   var total = countResult.total
  //   // 计算需分几次取
  //   var batchTimes = Math.ceil(total / 100)
  //   // 承载所有读操作的 promise 的数组
  //   var comments = []

  //   for (let i = 0; i < batchTimes; i++) {
  //     var res = await db.collection('interaction').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
  //       flag: 'comment',
  //       articalID: event.id
  //     }).get()
  //     comments = comments.concat(res.data)
  //   }

  //   data.comments = comments

  // }


  return data

}
//返回值：

//以下三种不一定全都有，取决于参数的传入情况
// comments: [],
// likes: [],
// stores: [],