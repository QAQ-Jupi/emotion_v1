const app = getApp();
const db = wx.cloud.database()
let rewardedVideoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {
      commentList: {}
    },
    collection: {
      status: false,
      text: "收藏",
      icon: "favor"
    },
    zan: {
      status: false,
      text: "点赞",
      icon: "appreciate"
    },
    userInfo: {},
    commentId: "",
    placeholder: "评论...",
    focus: false,
    toName: "",
    toOpenId: "",
    nodata_str: "暂无评论，赶紧抢沙发吧",
    isShow: false,
    isDisable: false,
    touchStartTime: 0,
    touchEndTime: 0,
    lastTapTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    wx.showLoading({
      title: '加载中',
    })
    options.collection="artical"
    console.log("头像：",app.globalData.myAvatarUrl)
    this.setData({
      _options: options,
      myAvatarUrl: app.globalData.myAvatarUrl,
    })

    const _ts = this;
    await this.getArtical(options)
    await app.getText(this.data.post.articalUrl, res => {
      let obj = app.towxml(res.data, 'markdown', {
        theme: 'light',
        events: {
          tap: (e) => {
            console.log('tap', e);
          }
        }
      });
      var list = _ts.data.post;
      list.artical = obj;
      _ts.setData({
        post: list,
      });
    });

    // //获取文章所有评论
    await this.getComment()
    await this.getZanStatus()
    await this.getCollectionStatus()
    await this.getLikeNum(options)
    this.uploadViewNum()
    wx.hideLoading()

  },
  myshare:function(){
    return {
      title: '聆绪',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
      },
      fail: function (res) {
        console.log(res + '失败');
      },
      complete: function (res) {
      }
    }
  },
  /**
   * 
   */
  onUnload: function() {
    if (rewardedVideoAd && rewardedVideoAd.destroy) {
      rewardedVideoAd.destroy()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 返回
   */
  navigateBack: function(e) {

  },

  /**
   * 获取点赞状态
   */
  getZanStatus() {
    const db = wx.cloud.database()
    const app = getApp()
    let that = this
    db.collection('interaction').where({
        userOpenid: app.globalData.openid,
        articalID: that.data.post._id,
        flag: 'like'
      })
      .get()
      .then(function(res) {
        console.log("【detail获取数据库interaction数据】【flag: 'like'】", res)
        if (res.data.length != 0) {
          that.setData({
            zan: {
              status: true,
              text: "已赞",
              icon: "appreciatefill"
            }
          })
        }
      }).catch(function(err) {
        console.log(err)
      })
  },

  /**
   * 获取收藏状态
   */
  getCollectionStatus() {
    const db = wx.cloud.database()
    const app = getApp()
    let that = this
    if (!that.data.collection.status) {
      db.collection('interaction').where({
          flag: 'artical',
          userOpenid: app.globalData.openid,
          articalID:that.data.post._id
        })
        .get()
        .then(function(res) {
          console.log("【detail获取数据库interaction数据】【flag: 'artical'】", res)
          if (res.data.length != 0) {
            that.setData({
              collection: {
                status: true,
                text: "已收藏",
                icon: "favorfill"
              }
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
    }
  },

  /**
   * 收藏功能
   */
  postCollection: async function() {
    let that = this
    if (!that.data.collection.status) {
      that.setData({
        collection: {
          status: true,
          text: "已收藏",
          icon: "favorfill"
        }
      })
      await wx.cloud.callFunction({
        name: 'uploadInteraction',
        data: {
          'flag': 'artical',
          'userOpenid': app.globalData.openid,
          'articalID': that.data.post._id,
          'articalName':that.data.post.title
        }
      }).then(function(res) {
        console.log("【detail调用函数uploadInteraction】【收藏成功】", res)
      }).catch(function(err) {
        console.log(err)
        wx.showToast({
          title: '收藏失败',
        })
        that.setData({
          collection: {
            status: false,
            text: "收藏",
            icon: "favor"
          }
        })
      })
    }else{
      that.setData({
        collection: {
          status: false,
          text: "收藏",
          icon: "favor"
        }
      })
      wx.cloud.callFunction({
        name: 'deleteAny',
        data: {
          'jihe':"interaction",
          "mywhere":{
            userOpenid:app.globalData.openid,
            flag:'artical',
            articalID:that.data._options.id,
          },
        }
      }).then(function(res) {
        console.log("【artical.detail调用函数deleteAny】【删除成功】", res)
      }).catch(function(err) {
        console.log(err)
        wx.showToast({
          title: '取消收藏失败',
        })
        that.setData({
          collection: {
            status: true,
            text: "已收藏",
            icon: "favorfill"
          }
        })
      })
    }
    
  },
  /**
   * 点赞功能
   */
  postZan: async function() {
    let that = this
    let app = getApp();
    //此处按照逻辑需要判断是否曾经点过赞
    //若点过赞，则不能多次点赞，增加数据库负担
    if (!that.data.zan.status) {
      that.setData({
        zan: {
          status: true,
          text: "已赞",
          icon: "appreciatefill"
        }
      })
      await wx.cloud.callFunction({
        name: 'uploadInteraction',
        data: {
          'flag': 'like',
          'userOpenid': app.globalData.openid,
          'articalID': that.data.post._id
          }
      }).then(function(res) {
        console.log("【detail调用函数uploadInteraction】【点赞成功】", res)
      }).catch(function(err) {
        console.log(err)
        wx.showToast({
          title: '点赞失败',
        })
        that.setData({
          zan: {
            status: false,
            text: "点赞",
            icon: "appreciate"
          }
        })
      })
    }else{
      that.setData({
        zan: {
          status: false,
          text: "点赞",
          icon: "appreciate"
        }
      })
      wx.cloud.callFunction({
        name: 'deleteAny',
        data: {
          'jihe':"interaction",
          "mywhere":{
            userOpenid:app.globalData.openid,
            flag:'like',
            articalID:that.data._options.id,
          },
        }
      }).then(function(res) {
        console.log("【artical.detail调用函数deleteAny】【删除成功】", res)
      }).catch(function(err) {
        console.log(err)
        wx.showToast({
          title: '取消点赞失败',
        })
        that.setData({
          zan: {
            status: true,
            text: "已赞",
            icon: "appreciatefill"
          }
        })
      })
    }
  },

  /**
   * 获取收藏和喜欢的状态
   */
  getPostRelated: async function(blogId) {
    let where = {
      postId: blogId,
      openId: app.globalData.openid
    }
    let postRelated = await api.getPostRelated(where, 1);
    let that = this;
    for (var item of postRelated.data) {
      if (config.postRelatedType.COLLECTION === item.type) {
        that.setData({
          collection: {
            status: true,
            text: "已收藏",
            icon: "favorfill"
          }
        })
        continue;
      }
      if (config.postRelatedType.ZAN === item.type) {
        that.setData({
          zan: {
            status: true,
            text: "已赞",
            icon: "appreciatefill"
          }
        })
        continue;
      }
    }
  },

  commentInput: function(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  /**
   * 提交评论
   * @param {} e 
   */
  // 防止重复点击
  timeOutSubmit: async function() {
    let that = this
    await that.setData({
      isDisable: true
    })
    that.formSubmit()
    setTimeout(function() {
      that.setData({
        isDisable: false
      })
    }, 3000);
  },

  formSubmit: function() {
    var that = this;
    wx.showToast({
      title: '发送中', 
      icon: 'loading'
    });
    try {
      let that = this;
      let commentPage = 1
      let content = that.data.commentContent;
      if (content == undefined || content.length == 0) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }
      const app = getApp()
      wx.cloud.callFunction({
        name: 'msgSecCheck',
        data: {
          content: content
        }
      }).then(function(res) {
        console.log("【敏感信息检测】", res.result)
        if (res.result.errCode == 0) {
          wx.cloud.callFunction({
            name: 'uploadInteraction',
            data: {
              'flag': "comment",
              'userOpenid': app.globalData.openid,
              'imgUrl': app.globalData.myAvatarUrl,
              'nickname': app.globalData.myWxname,
              'articalID': that.data.post._id,
              'comment': content,
            },
            success: function(res) {
              console.log("【detail调用函数uploadInteraction】【flag: 'comment'】", res)
              var newC={}
              newC.imgUrl=app.globalData.myAvatarUrl
              newC.nickname=app.globalData.myWxname
              newC.comment=content
              var mypost=that.data.post
              mypost.commentList=mypost.commentList.concat(newC)
              that.setData({
                commentContent:"",
                post:mypost
              })
              wx.hideToast();
              wx.showToast({
                title: '发送成功！',
                icon: 'none',
                duration: 3000,
              })  
            },
            fail: function(err) {
              console.log(err)
              wx.hideToast();
              wx.showToast({
                title: '发送失败！',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
          })
        } else {
          wx.hideToast();
          wx.showToast({
            title: '发送失败！涉及敏感信息',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
      }).catch(function(err) {
        console.log(err)
        wx.hideToast();
        wx.showToast({
          title: '发送失败！',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      })
    } catch (err) {
      wx.hideToast();
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.log(err)
    }

  },
  /**
   * 显示隐藏功能
   */
  showMenuBox: function() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  /**
   * 失去焦点时
   * @param {*} e 
   */
  onReplyBlur: function(e) {
    let that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        commentId: "",
        placeholder: "评论...",
        toName: ""
      });
    }
  },

  // 获取文章详情
  async getArtical(options) {
    let that = this
    let db = wx.cloud.database()
    console.log("detail页面【传入参数】", options)
    await db.collection(options.collection).doc(options.id)
      .get()
      .then(function(res) {
        console.log("【detail获取数据库" + options.collection + "数据】", res)
        let _id = "post._id"
        let title = "post.title"
        let defaultImageUrl = "post.defaultImageUrl"
        let articalUrl = "post.articalUrl"
        let createTime = "post.createTime"
        let collection = "post.collection"
        let viwerNum = "post.totalVisits"
        let month = res.data.time.getMonth() + 1;
        that.setData({
          [_id]: res.data._id,
          [title]: res.data.title,
          [defaultImageUrl]: res.data.coverImgUrl,
          [articalUrl]: res.data.contextUrl,
          [createTime]: res.data.time.getFullYear() + '年' + month + '月' + res.data.time.getDate() + '日',
          [collection]: res.data.collection,
          [viwerNum]: res.data.viwerNum + 1
        })
      }).catch(function(err) {
        console.log(err)
      })
  },

  getComment: async function() {
    var that = this;
    await wx.cloud.callFunction({
      name: 'getInteraction',
      data: {
        'comment': true,
        'like': false,
        'store': false,
        'type': 1,
        'id': that.data.post._id
      }
    }).then(function(res) {
      console.log("【detail调用函数getInteraction】【comment】", res)
      let comments = res.result.comments
      let commentList = "post.commentList"
      that.setData({
        [commentList]: comments
      })
    }).catch(function(err) {
      console.log(err)
    })
  },

  getLikeNum: function(options) {
    let that = this
    wx.cloud.callFunction({
      name: 'getInteractionNum',
      data: {
        'comment': false,
        'like': true,
        'selfLike': false,
        'id': options.id
      }
    }).then(function(res) {
      console.log("【detail调用函数getInteractionNum】", res)
      let like = "post.totalZans"
      that.setData({
        [like]: res.result.likesLen
      })
    })
  },

  uploadViewNum: function() {
    let that = this
    wx.cloud.callFunction({
      name: 'uploadViewNum',
      data: {
        collection: that.data._options.collection,
        _id: that.data._options.id
      }
    }).then(function(res) {
      console.log("【detail调用函数uploadViewNum】", res)
    }).catch(function(err) {
      console.log(err)
    })
  },

  back: function() {
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    var currentPage = pages[pages.length - 1];
    beforePage.uploadViewNum(this.data._options)
  },
})