// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emotions: [{
        title: "积极",
        type: 'positive'
      },
      {
        title: "中立",
        type: 'neutral'
      },
      {
        title: "消极",
        type: 'negative'
      }
    ],
    i: 0,
    newsList:[],
    bottomtext:"---到底啦---"
  },
  tabSelect: function (e) {
    /*获取可视窗口宽度*/
    var w = wx.getSystemInfoSync().windowWidth;
    var leng = this.data.emotions.length;
    var i = e.target.dataset.i;
    if (i != this.data.i) {
      this.setData({
        i: e.target.dataset.i
      })
    }
  },
  changeSwipe: function (e) {
    var adress = (e.detail.current == 0) ? "积极" : ((e.detail.current == 1) ? "中立" : "消极");
    console.log("目前在", adress);
    var type = e.detail.current;
    this.setData({
      i: type
    });
  },
  getArticals: async function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    await wx.cloud.callFunction({
      name: 'getArticals',
      data: {},
      success: function(res) {
        console.log("【调用函数getArticals】", res.result)
        var news=res.result
        for (let item of news) {
          item.time = item.time.substring(0, 10);
        }
        wx.hideLoading()
        that.setData({
          newsList: news
        })
      },
      fail: console.error
    })
  },
  jumpNew:function(e){
    var id=e.currentTarget.dataset.id
    console.log('文章id：',id)
    wx.navigateTo({
      url: './artical/artical?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticals()
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