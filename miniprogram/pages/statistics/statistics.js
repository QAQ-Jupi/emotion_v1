// pages/statistics/statistics.js
// 1、引入依赖脚本
import * as echarts from '../../ec-canvas/echarts';

function setDayOption(chart,dayPosi,dayNege,dayNetu) {
  var option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: dayNege,
        name: '消极'
      }, {
        value: dayPosi,
        name: '积极'
      }, {
        value: dayNetu,
        name: '中性'
      }, ]
    }]
  };

  chart.setOption(option);
}

function setweekOption(chart,weekTime,weekNum,weekPosi,weekNege) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['总数', '积极', '消极']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data:weekTime,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '总数',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: weekNum,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '积极',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: weekPosi,
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '消极',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: weekNege,
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };
  chart.setOption(option);
}
function setMonthOption(chart,MonthTime,MonthPosi,MonthNege,MonthNetu) {
  var option = {
    title: {
      text: '近一个月的情绪波动',
      left: 'center'
    },
    legend: {
      data: ['积极', '中性', '消极'],
      top: 50,
      left: 'center',
      backgroundColor: 'white',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: MonthTime,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '积极',
      type: 'line',
      smooth: true,
      data:MonthPosi
    }, {
      name: '中性',
      type: 'line',
      smooth: true,
      data:MonthNetu
    }, {
      name: '消极',
      type: 'line',
      smooth: true,
      data: MonthNege
    }]
  };

  chart.setOption(option);
}
var util = require('../../utils/util.js');
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec0:{
      lazyLoad: true,
    },
    ec1: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
      // onInit: initChart // 3、将数据放入到里面
    },
    ec2:{
      lazyLoad: true,
    },
    isLoaded: false,
    isDisposed: false,
    emoList: '',
    total: '',
    daytotal:'',
    date:'',
    mode:'',
    dayPosi:'',
    dayNege:'',
    dayNetu:'',
    weekNum:[1,3,4],
    weekPosi:[2,2,2],
    weektime:[3,3,3],
    weekNege:[4,3,3],
    Monthtime:[] ,
    MonthNetu:[],
    MonthNege:[],
    MonthPosi:[],
  },
  dayMode:function(){
    this.setData({
      mode: 0 ,
    })
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });
    var that=this
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    var dayNetu=0
    var dayPosi=0
    var dayNege=0
    for (let i = 0; i < that.data.emoList.length; i++) {
      var time = new Date(that.data.emoList[i].time)
      if(time.getFullYear()==Y&&time.getMonth()+1==M&&time.getDate()==D)
      {
        if(that.data.emoList[i].emotion=="negative")
        {
          dayNege=dayNege+1
        }
        else if(that.data.emoList[i].emotion=="positive")
        {
          dayPosi=dayPosi+1
        }
        else{
          dayNetu=dayNetu+1
        }
      }
    }
    this.setData({
      dayPosi: dayPosi,
      dayNege: dayNege,
      dayNetu:dayNetu
    });
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setDayOption(chart,this.data.dayPosi,this.data.dayNege,this.data.dayNetu);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  MonthMode:function(){
    this.setData({
      mode: 2 ,
    })
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });

    var that=this
    var timestamp = Date.parse(new Date());
    timestamp=timestamp/1000

    var Monthtime=[] 
    var MonthNetu=[]
    var MonthNege=[]
    var MonthPosi=[]
    for(let day=30; day>=0; day--){
      var netimestamp=timestamp - 24 * 60 * 60*day;
      netimestamp=netimestamp*1000
      var date = new Date(netimestamp);
      //获取年份  
      var Y =date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
      var dayNetu=0
      var daytime=Y+"-"+M+"-"+D
      var dayPosi=0
      var dayNege=0
      for (let i = 0; i < that.data.emoList.length; i++) {
        var time = new Date(that.data.emoList[i].time)
        if(time.getFullYear()==Y&&time.getMonth()+1==M&&time.getDate()==D)
        {
          if(that.data.emoList[i].emotion=="negative")
          {
            dayNege=dayNege+1
          }
          else if(that.data.emoList[i].emotion=="positive")
          {
            dayPosi=dayPosi+1
          }
          else{
            dayNetu=dayNetu+1
          }
        }
      }
      Monthtime =Monthtime.concat(daytime)
      MonthNetu =MonthNetu.concat(dayNetu)
      MonthNege =MonthNege.concat(dayNege)
      MonthPosi =MonthPosi.concat(dayPosi)
    }
    this.setData({
      Monthtime: Monthtime,
      MonthNetu:MonthNetu,
      MonthNege:MonthNege,
      MonthPosi:MonthPosi,
    })
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setMonthOption(chart,this.data.Monthtime,this.data.MonthPosi,this.data.MonthNege,this.data.MonthNetu);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });


      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });


  },
  YearMode:function(){
    this.setData({
      mode: 3 ,
    })
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });
  },
  weekMode: function(){
    this.setData({
      mode: 1 ,
    })
    var that=this
    var timestamp = Date.parse(new Date());
    timestamp=timestamp/1000

    var weektotal=[]
    var weektime=[]
    var weekPosi=[]
    var weekNege=[]
    for(let day=0; day<7; day++){
      var netimestamp=timestamp - 24 * 60 * 60*day;
      netimestamp=netimestamp*1000
      var date = new Date(netimestamp);
      //获取年份  
      var Y =date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
      var daytotal=0
      var daytime=Y+"-"+M+"-"+D
      var dayPosi=0
      var dayNege=0
      for (let i = 0; i < that.data.emoList.length; i++) {
        var time = new Date(that.data.emoList[i].time)
        if(time.getFullYear()==Y&&time.getMonth()+1==M&&time.getDate()==D)
        {
          daytotal=daytotal+1
          if(that.data.emoList[i].emotion=="negative")
          {
            dayNege=dayNege+1
          }
          if(that.data.emoList[i].emotion=="positive")
          {
            dayPosi=dayPosi+1
          }
        }
      }
      weektime =weektime.concat(daytime)
      weektotal =weektotal.concat(daytotal)
      weekNege =weekNege.concat(dayNege)
      weekPosi =weekPosi.concat(dayPosi)
    }
    this.setData({
      weekNum:weektotal,
      weekPosi:weekPosi,
      weektime:weektime,
      weekNege:weekNege,
    })
    console.log(this.data.weektime)
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setweekOption(chart,this.data.weektime,this.data.weekNum,this.data.weekPosi,this.data.weekNege);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          total:res.result.total,
        })
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y =date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
        var daytotal=0
        var todayemos=[]
        for (let i = 0; i < that.data.emoList.length; i++) {
          var time = new Date(that.data.emoList[i].time)
          if(time.getFullYear()==Y&&time.getMonth()+1==M&&time.getDate()==D)
          {
            console.log(that.data.emoList[i])
            todayemos = todayemos.concat(that.data.emoList[i])
            daytotal=daytotal+1
          }
        }
        that.setData({
          daytotal:daytotal,
          date:Y+"-"+M+"-"+D
        })
        console.log(that.data.emoList)
        wx.hideToast();
      }).catch(function(err) {
        console.log(err)
        wx.hideToast();
      })
      that.dayMode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
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