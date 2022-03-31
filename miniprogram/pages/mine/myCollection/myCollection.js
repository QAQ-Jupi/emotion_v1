// pages/mine/myCollection/myCollection.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        articalList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        wx.cloud.callFunction({
            name: 'getInteraction',
            data: {
              'type':0,
              'comment': false,
              'like': false,
              'store': true,
              'openid': app.globalData.openid,
            }
        }).then(function(res) {
            console.log("【my.myCollection调用函数getInteraction】", res.result)
            for(let item of res.result.stores){
                if(item.flag == 'artical'){
                    that.setData({
                      articalList: that.data.articalList.concat(item)
                    })
                }
            }
          }).catch(function(err) {
            console.log(err)
          })
          
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})