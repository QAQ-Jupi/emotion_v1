// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/*  参数表：
   //interaction(交互：评论、点赞、收藏)
{
    //欣赏作品界面收藏类
    "flag": "appreciate",           //类别：欣赏作品
    "userOpenid": "",         //用户的openid
    "contextId": "",          //作品id号
    'contextName':"",       //作品名称

    //识别界面收藏类
    'flag': 'recognition',
    'userOpenid': app.globalData.openid,
    'imgPath': img_fileID,
    'style': that.data.style,
    'fonts': that.data.fonts

    //评分界面收藏类
    'flag': 'grade',
    'userOpenid': app.globalData.openid,
    'imgPath': img_fileID,
    'style': that.data.style,
    'font': that.data.font,
    'comment':that.data.comment,
    'score':that.data.score,

    //字典界面收藏类
    'flag': 'dictionary',
    'userOpenid': app.globalData.openid,
    'search_word': that.data.index,

    //资讯界面首次类
    'flag': 'artical',
    'userOpenid': app.globalData.openid,
    'articalID': that.data.post._id,
    'articalName':that.data.post.title

     //评论类的
    "flag": "comment",        //类别：评论
    "userOpenid": "",         //用户的openid
    "imgUrl": "",             //头像链接
    "nickname": "",           //昵称
    "articalID": "",          //文章id号
    "comment": "",            //评论

    //或者
    //点赞类
    "flag": "like",           //类别：点赞
    "userOpenid": "",         //用户的openid
    "articalID": "",          //文章id号
}
*/

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("传入参数：", event)
  var flag = event.flag
  if (flag == 'comment') {
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          imgUrl: event.imgUrl,
          nickname: event.nickname,
          articalID: event.articalID,
          comment: event.comment,
          time: new Date(),
          type: event.type,
          isCheck: 0
        }
      })
    } catch (e) {
      console.error(e)
    }
  } else if (flag == 'like') {
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          articalID: event.articalID,
          userOpenid: event.userOpenid,
        }
      })
    } catch (e) {
      console.error(e)
    }
  }else if (flag == 'appreciate') {
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          _openid:event.userOpenid,
          contextId: event.contextId,
          contextName:event.contextName,
          time: new Date(),
        }
      })
    } catch (e) {
      console.error(e)
    }
  }else if(flag == 'recognition'){
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          _openid:event.userOpenid,
          imgPath: event.imgPath,
          style: event.style,
          fonts: event.fonts,
          time: new Date(),
        }
      })
    } catch (e) {
      console.error(e)
    }
  }else if(flag == 'grade'){
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          _openid:event.userOpenid,
          imgPath: event.imgPath,
          style: event.style,
          font: event.font,
          comment:event.comment,
          score:event.score,
          time: new Date(),
        }
      })
    } catch (e) {
      console.error(e)
    }
  }else if(flag == 'dictionary'){
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          _openid:event.userOpenid,
          search_word: event.search_word,
          time: new Date(),
        }
      })
    } catch (e) {
      console.error(e)
    }
  }else if(flag == 'artical'){
    try {
      return await db.collection('interaction').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          flag: event.flag,
          userOpenid: event.userOpenid,
          _openid:event.userOpenid,
          articalID: event.articalID,
          articalName:event.articalName,
          time: new Date(),
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

}