// pages/cover/cover.js
Page({

  login(){
    wx.getUserProfile({
      desc: '必须进行授权',
      success: res=>{
        console.log('授权成功',res.userInfo)
        var name = res.userInfo.nickName;
        var pic = res.userInfo.avatarUrl;
        wx.reLaunch({
          url: '../mine/mine?name='+name+'&pic='+pic,
        })
      },
      fail:res=>{
        console.log('授权失败',res)
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'login',
    }).then(res => {
      console.log('【index调用云函数login返回值】', res.result)
      app.globalData.openid = res.result.openid
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})