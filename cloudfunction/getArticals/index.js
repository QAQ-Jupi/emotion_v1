// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  console.log('传入参数：', event)
  // 先取出集合记录总数
  const countResult = await db.collection('artical').where({}).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const result = []
  for (let i = 0; i < batchTimes; i++) {
    var res = await db.collection('artical').where({
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    for (item of res.data) {
      result.push(item)
    }
  }
  return result
}