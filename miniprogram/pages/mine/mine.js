// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sub: false,
  },
  jumpCollection:function(){
    wx.navigateTo({
      url: './myCollection/myCollection',
    })
  },

  txc:function(){
    wx.openEmbeddedMiniProgram({
        appId: "wx8abaf00ee8c3202e",
        extraData :{
          // 把1368数字换成你的产品ID，否则会跳到别的产品
          id : "399910",
          // 自定义参数，具体参考文档
          customData : {
              clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
          }
        }
      })
  },

  jumpAbout:function(){
      wx.navigateTo({
        url: './about/about',
      })
  },

  reply: function() {
    this.setData({
      sub: true,
    })
  },

  cancel: function() {
    this.setData({
      sub: false,
    })
  },


  logout: function() {
    wx.reLaunch({
      url: '../cover/cover',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // console.log(options.name)
    this.setData({
      name: app.globalData.myWxname,
      pic: app.globalData.myAvatarUrl
    })
  
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