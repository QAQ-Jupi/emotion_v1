// app.js
App({
  towxml:require('/towxml/index'),
  getText: (url, callback) => {
		wx.request({
			url: url,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (typeof callback === 'function') {
					callback(res);
				};
			}
		});
	},
  onLaunch: async function() {
    //云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        // 如不填则使用默认环境（第一个创建的环境）
        env: 'emotion-cloud-8gqrwg1n2d75cb63',
        traceUser: true,
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData = {}
    try {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      // 全局数据
      await this.initUserInfo()
      console.log("【全局数据加载完成】globalData：", this.globalData);
    } catch (e) {
      console.log(e);
    } finally {
      wx.hideLoading()
    }
  },
  async getUserProfile() {
    /**
     * 获取头像和用户名
     */
    return await new Promise((reslove, reject) => {
      wx.showModal({
        title: '温馨提示',
        content: '请允许获取您的头像和微信名称',
        success: (({
          confirm
        }) => {
          if (confirm) {
            console.log(confirm);
            wx.getUserProfile({
              desc: "获取你的昵称、头像、地区及性别",
            }).then(res => {
              this.globalData.myWxname = res.userInfo.nickName;
              this.globalData.myAvatarUrl = res.userInfo.avatarUrl;
              console.log('用户允许获取用户信息')
              //添加用户信息，只保存用户名和头像链接
              wx.cloud.callFunction({
                name: 'addAny',
                data: {
                  jihe: 'user_data',
                  openid: true, // 自动注入openid
                  mydata: {
                    myWxname: res.userInfo.nickName,
                    myAvatarUrl:res.userInfo.avatarUrl,
                  },
                }
              }).then(res => {
                console.log("添加用户成功：",res);
              })
            })
          } else {
            this.globalData.myWxname = '游客';
            this.globalData.myAvatarUrl = 'cloud://emotion-cloud-8gqrwg1n2d75cb63.656d-emotion-cloud-8gqrwg1n2d75cb63-1310366157/default.png';
            console.log('用户拒绝获取用户信息')
          }
        })
      })
    })
  },
  async initUserInfo() {
    /**
     * 获取用户个人信息
     */
    await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getOpenID',
      data: {
      }
    }).then(res => {
      console.log('我的Openid：', res.result.openid)
      this.globalData.openid = res.result.openid
    })
    await wx.cloud.callFunction({
      name: 'getAny',
      data: {
        jihe:'user_data',
        mywhere: {
          openid:this.globalData.openid,
        }
      }
    }).then(async res => {
      console.log("res.result:",res.result)
      if (res.result.length == 0) {
        // 还没注册到person表的用户
        wx.hideLoading()
        await this.getUserProfile()
        wx.showLoading({
          title: '加载中',
          mask: true
        })
      }
      Object.assign(this.globalData, res.result[0])  
    })
  },
})
