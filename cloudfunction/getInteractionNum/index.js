// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
/*  参数表：
    {
      comment: bool         //是否要获取评论长度
      like: bool            //是否获取点赞长度
      selfLike: bool        //是否获取自己是否点赞

      id: string            //必填
      openid: string        //如果需要查是否点赞过，则必须提供
    }
*/

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入参数：', event)

  var data = {}
  var commentsLen = 0
  var likesLen = 0
  var isLike

  if (event.comment) {
    var countResult = await db.collection('interaction').where({
      flag: 'comment',
      articalID: event.id
    }).count()
    commentsLen = countResult.total

    data.commentsLen = commentsLen
  }

  if (event.like) {
    var countResult = await db.collection('interaction').where({
      flag: 'like',
      articalID: event.id
    }).count()
    likesLen = countResult.total

    data.likesLen = likesLen
  }

  if(event.store){
    var countResult = await db.collection('interaction').where({
      flag: 'store',
      articalID: event.id
    }).count()
    storesLen = countResult.total

    data.storesLen = storesLen
  }

  if (event.selfLike) {
    var res = await db.collection('interaction').where({
      flag: 'like',
      contextId: event.id,
      userOpenid: event.openid
    }).count()
    if (res.total != 0)
      isLike = true
    else
      isLike = false
    
    data.isLike = isLike
  }
  return data
}
//返回值：

//以下三种不一定全都有，取决于参数的传入情况
// commentsLen: ,评论长度
// likesLen: ,点赞人数
// isLike: bool,是否自己点赞
//storesLen ,收藏人数
