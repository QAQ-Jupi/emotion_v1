// pages/record/record.js
var util = require('../../utils/util.js');
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList:{
      E:["SUM", "MON", "TUE", "WED", "THUR", "FRI", "SAT"]
    }, //存储缩写

    chosen:{
      date: '',
      month: '',
      year: ''
    }, //被选中的日期

    show:{
      month: '',
      year: ''
    }, //顶部显示的年月


    emoList:[],
    daydata:[],

    monthList:{}, //存储显示出来的月份的全部日期

    showPopup: 0

  },

  //计算一个月的最大天数
  dayMax:function(year, month) {
    var maxDay = 31;
    if(year%4==0 && month==2)
      maxDay = 29;
    else if(month==2)
      maxDay = 28;
    else if(month==4 || month==6 || month==9 || month==11 )
      maxDay = 30;
    return maxDay;
  },

  //返回所需日期数据，包括当天的与全月的
  timeList:function(y, m){
    var date = new Date();

    var year = date.getFullYear(); //年
    var month = date.getMonth()+1; //月
    var nowDate = date.getDate(); //日

    var week_i = date.getDay(); //周几
    var week = this.data.weekList.E[week_i]; //转化为缩写

    var dayMax = this.dayMax(year, month); //一个月最大天数

    var yearDay = year; //默认为今天的年份
    var monthDay = month; //默认为今天的月份

    if(y&&m){ //如果传入了年份月份，即指定年月
      yearDay = y; //指定的年份
      monthDay = m; // 指定的月份
      var dayMax_day = this.dayMax(y,m); //指定年月的最大天数
      var weekDate = new Date(y+'/'+m+'/1');
      var weekDay = weekDate.getDay(); //该月一号是周几 
    }
    else{ //未传入年月，即指今天所在年月
      var dayMax_day = dayMax; 
      var weekDate = new Date(year+'/'+month+'/1');    
      var weekDay = weekDate.getDay(); //该月一号是周几   
    }

    //存储日期
    var monthList=[];
    for(var i=1;i<=dayMax_day;i++){
      monthList.push({
        yearDay: yearDay,
        monthDay: monthDay,
        day:i,
        week:this.data.weekList.E[(weekDay+i-1)%7]
      })
    }

    return{
      today:{
        nowYear: yearDay,
        nowMonth: monthDay,
        nowDate: nowDate,
        nowweek: week
      },
      monthList,
      monthDay,
      yearDay
    };
  },

  //点击上个月
  front: function () {
    var year = this.data.show.year;
    var month = this.data.show.month;

    if(month==1){
      month = 12;
      year = year - 1;
    }
    else{
      month = month - 1;
    }

    var date = this.timeList(year, month);
    // console.log(date);

    this.setData({
      monthList: date.monthList,
      'show.month': month,
      'show.year': year
    })
  },

  //点击下个月
  next: function () {
    var year = this.data.show.year;
    var month = this.data.show.month;

    if(month==12){
      month = 1;
      year = year + 1;
    }
    else{
      month = month + 1;
    }

    var date = this.timeList(year, month);
    // console.log(date);

    this.setData({
      monthList: date.monthList,
      'show.month': month,
      'show.year': year
    })
  },

  //点击选择日期，将点击日期赋值到data里
  dayChosen: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    // console.log(this.data.monthList[0]);

    that.setData({
      'chosen.date': index+1,
      'chosen.month': this.data.monthList[index].monthDay,
      'chosen.year': this.data.monthList[index].yearDay,
    })
    var that=this
    wx.showToast({
      title: '加载中', 
      icon: 'loading'
    });
      wx.cloud.callFunction({
        name: 'getemo',
        data: {
          'openid': app.globalData.openid,
        }
      }).then(function(res) {
        console.log("【调用函数getemo】", res)
        that.setData({
          emoList:res.result.emos.reverse(),
        })
        var todayemos=[]
        for (let i = 0; i < that.data.emoList.length; i++) {
          var time = new Date(that.data.emoList[i].time)
          if(time.getFullYear()==that.data.chosen.year&&time.getMonth()+1==that.data.chosen.month&&time.getDate()==that.data.chosen.date)
          {
            todayemos = todayemos.concat(that.data.emoList[i])
          }
        }     
        that.setData({
          daydata:todayemos,
        })
        console.log(that.data.daydata)
        wx.hideToast();
      }).catch(function(err) {
        console.log(err)
        wx.hideToast();
      })
    // console.log(this.data.chosen)
  },

  //展开详情页
  showDetails: function(){
    this.setData({
      showPopup: 1
    })
    // console.log("123")
  },

  //关闭详情页
  back: function(){
    this.setData({
      showPopup: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = this.timeList();
    this.setData({
      monthList: date.monthList,
      today: date.today,
      'chosen.date': date.today.nowDate,
      'chosen.month': date.monthDay,
      'chosen.year': date.yearDay,
      'show.month': date.monthDay,
      'show.year': date.yearDay
    })

    console.log(this.data)
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