const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true,
    bgLink: 'https://7368-shigu-1gx1m7xt936b40de-1304982729.tcb.qcloud.la/darkgreen.png?sign=fd3882d19018a97c01b15ef60702c468&t=1618580466'
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    istogeren: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome() {
      wx.navigateBack({
        delta: 1
      });
    },
    togeren(){
      wx.navigateTo({
        url: '/pages/my/my',
      })
    }
  }
})