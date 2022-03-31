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
    recommend:[],
    i: 0,
    newsList:[],
    bottomtext:"---到底啦---"
  },
  
  tabSelect: function (e) {
    /*获取可视窗口宽度*/
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

  //获取文章列表
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
        let news=res.result
        for (let item of news) {
          item.time = item.time.substring(0, 10);
        }
        var recommend = []
        recommend = that.getRandomArrayElements(news,3)
        wx.hideLoading()
        that.setData({
            newsList: news,
            recommend: recommend
        })
      },
      fail: console.error
    })
  },

  //随机取出arr数组的count个元素
  getRandomArrayElements: function(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },

  //跳转文章详情
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