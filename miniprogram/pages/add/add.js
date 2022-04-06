// pages/add/add.js
const format=require("../../utils/util.js");
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 0, //0为手动档，1为自动挡
    emotionNum: 1, //0为positive，1为neutral，2为negative
    emotionText: 'neutral', //默认为neutral
    emotionPic: '/images/expressions/neutral.png', //默认为neutral

    date: '添加日期', //显示选择的日期，默认初始值是“添加日期”
    time: '添加时间', //显示选择的时间，默认初始值是“添加时间”

    //所有的标签，false表示未被选中、true表示选中，第三位用于标记class
    positive:[
      [ ['钦佩',false,'td'], ['崇拜',false,'td'], ['兴奋',false,'td'], ['快乐',false,'td'] ],
      [ ['自豪',false,'td'], ['解脱',false,'td'], ['浪漫',false,'td'], ['满足',false,'td'] ],
      [ ['希望',false,'td'], ['幸福',false,'td'], ['安心',false,'td'], ['','','blanktd'] ]
    ],

    neutral:[
      [ ['敬畏',false,'td'], ['平静',false,'td'], ['渴望',false,'td'], ['怀旧',false,'td'] ],
      [ ['意外',false,'td'], ['无聊',false,'td'], ['专注',false,'td'], ['放松',false,'td'] ],
      [ ['惊奇',false,'td'], ['','','blanktd'], ['','','blanktd'], ['','','blanktd'] ]
    ],

    negative:[
      [ ['愤怒',false,'td'], ['焦虑',false,'td'], ['尴尬',false,'td'], ['困惑',false,'td'] ],
      [ ['鄙视',false,'td'], ['失望',false,'td'], ['厌恶',false,'td'], ['妒忌',false,'td'] ],
      [ ['恐惧',false,'td'], ['内疚',false,'td'], ['悲伤',false,'td'], ['疲惫',false,'td'] ]
    ],

    showFeeling: [], //显示的标签，用深拷贝方式获取上面三个列表中的其中一个
    selectFeeling:[], //存储被选中的标签

    nowemotion: "unknown",
    nowtime: "",
    nowpic:"../../images/chooseImage3.png",
    nowdetail:'',
  },
  getContentInput(e){
    const value = e.detail.value;
    this.data.content = value;
    // var len = parseInt(value.length);
    this.setData({
      // contentCount: len,
      nowdetail:e.detail.value
    })
  },
//选择图片
chooseImage: function () {
  var _this = this;
  wx.showModal({
    title: '温馨提示',
    content: '请选择一张你当前面部的一张图片。',
    showCancel: false,
    confirmText: '确定',
    confirmColor: '#04213c',
    success: function(res) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths[0];
          // 获取图片路径
          // app.globalData.imgPath = tempFilePaths
          // console.log(tempFilePaths);
          wx.showLoading({
            title: '识别中……',
            mask: true
          });
          wx.uploadFile({
            url: 'https://www.sxshufa.top/recognition/EmotionRecognition',
            filePath: tempFilePaths,
            name: 'picture',
            success: function (res) {
              var result = JSON.parse(res.data)
              console.log(result)
              var emotion = result.emotion
              wx.hideLoading()
              if (emotion == '') {
                wx.showModal({
                  title: '无法识别',
                  content: '很抱歉，该图片无法识别，请选择其他图片。',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#cc9933',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }else{

                _this.setData({
                  nowemotion : emotion,
                  nowpic : tempFilePaths
                })
                console.log("可以了!"+_this.data.nowemotion)
              }
            },
            fail:function(res){
              wx.showModal({
                title: '很抱歉！',
                content: '连接失败。',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#cc9933',
                complete: function (res) {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }
          });
          // wx.navigateTo({
          //   url: 'upload/upload?imgpath=' + tempFilePaths,
          // });
        }
      });
    }
  })    
},
  //点击‘手动操作’触发事件，将mode改为0
  manualMode: function(){
    this.setData({
      mode: 0,
      nowdetail: ''
    })
    this.EmotionChange()
  },  
  //点击‘实时扫描’触发事件，将mode改为1
  realtimeMode: function(){
    this.setData({
      mode: 1 ,
      nowdetail: '',
    })
    this.EmotionChange()
  },

  //手动模式下切换情绪触发事件
  changeClick: function(e){
    var actionGet = e.currentTarget.dataset.index; //获取点击按钮，-1往前，1往后
    var actionGive = 0; //代表3种情绪的代码
    //根据前进或后退进行相应操作
    if(this.data.emotionNum==0 && actionGet==-1){
        actionGive = 2;
    }
    else if(this.data.emotionNum==2 && actionGet==1){
        actionGive = 0;
    }
    else{
      actionGive = this.data.emotionNum + parseInt(actionGet);
    }
    this.setData({
      emotionNum: actionGive //最终赋值到data，改变显示的情绪
    })
    // console.log(this.data.emotionNum);
    this.EmotionChange();
  },

  //切换情绪，将显示的情绪、情绪表情、标签根据切换结果进行切换
  EmotionChange: function(){
    var Etext = '';
    var EPic = '';
    var ELabels = '';
    if(this.data.emotionNum==0){
      Etext = 'positive';
      EPic = '/images/expressions/positive.png';
      ELabels = JSON.parse(JSON.stringify(this.data.positive)); //深拷贝
    }
    else if(this.data.emotionNum==1){
      Etext = 'neutral';
      EPic = '/images/expressions/neutral.png';
      ELabels = JSON.parse(JSON.stringify(this.data.neutral)); //深拷贝
    }
    else{
      Etext = 'negative';
      EPic = '/images/expressions/negative.png';
      ELabels = JSON.parse(JSON.stringify(this.data.negative)); //深拷贝
    }

    this.setData({
      emotionText: Etext,
      emotionPic: EPic,
      showFeeling: ELabels,
      selectFeeling: []
      
    })
    // console.log('change');
  },

  //日期选择事件
  listenerDatePickerSelected: function(e){
    this.setData({
      date: e.detail.value
    })
  },

  //事件选择事件
  listenerTimePickerSelected: function(e){
    this.setData({
      time: e.detail.value
    })
    console.log(this.data.date+this.data.time)
  },

  //标签选择事件
  labelSelected: function(e){
    //获取被点击标签的位置
    var tr = e.currentTarget.dataset.indextr;
    var td = e.currentTarget.dataset.indextd;

    this.data.showFeeling[tr][td][1] = !this.data.showFeeling[tr][td][1];
    this.setData({
      showFeeling: this.data.showFeeling
    })

    var selectList = this.data.selectFeeling;
    if(this.data.showFeeling[tr][td][1] && this.data.showFeeling[tr][td][0]!=''){
      selectList.push(this.data.showFeeling[tr][td][0]);
      this.data.showFeeling[tr][td][2] = 'chosentd';
      this.setData({
        showFeeling : this.data.showFeeling
      })
    }
    else{
      for(var i=0; i<selectList.length; i++){
        if(selectList[i] == this.data.showFeeling[tr][td][0]){
          selectList.splice(i, 1);
          break;
        }
      }
      this.data.showFeeling[tr][td][2] = 'td';
      this.setData({
        showFeeling : this.data.showFeeling
      })
    }
    console.log(this.data.selectFeeling)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var diffShowFeeling = JSON.parse(JSON.stringify(this.data.neutral)) //深拷贝
    this.setData({
      showFeeling: diffShowFeeling
    })
    console.log("成功")
    console.log(this.data.selectFeeling)

    let that = this;
    
    setInterval(function () {
      that.setData({
        nowtime: util.formatTime(new Date())
      });
    }, 1000);
 
 
   
  },
  toagain: function(){
    let that = this
    if(that.data.mode==0) {
      that.manualMode()
    }
    else{
      console.log("重来")
      that.realtimeMode()
      that.setData({
        nowpic:"../../images/chooseImage3.png",
        nowemotion:"unknown"
      })
    }
  },
  postemotion: async function() {
    let that = this
    if(that.data.mode==1)
    {
      //将照片上传至云端需要刚才存储的临时地址
      var timestamp = Date.parse(new Date());  
      timestamp = timestamp / 1000; //当前的秒
      console.log(that.data.showFeeling);
      wx.cloud.uploadFile({
        cloudPath: 'recognition/' + app.globalData.openid + '/'+ timestamp  +'.jpg',
        filePath: that.data.nowpic,  
        success(res) {
          console.log("图片上传成功")
          var img_fileID=res.fileID //图片存储到云存储的fileID
          wx.cloud.callFunction({
            name: 'uploademo',
            data: {
              'userOpenid': app.globalData.openid,
              'imgPath': img_fileID,
              'mode' : that.data.mode,
              'emotion': that.data.nowemotion,
              'time': that.data.nowtime,
              'label' : that.data.selectFeeling,
              'detail': that.data.nowdetail
            }
          }).then(function(res) {
            console.log("【调用函数uploademo】【保存成功】", res)
          }).catch(function(err) {
            console.log(err)
            wx.showToast({
              title: '保存失败',
            })
          })
          },
        fail(err) {
          wx.showToast({
            title: '保存失败',
          })
        }
      })
    }
    else{
      console.log("这是mode等于0")
      console.log(that.data.date)
      var date=that.data.date+" "+that.data.time
      // var date = format.formatTime(date ,'Y/M/D h:m:s');
      if(that.data.date!="添加日期" && that.data.time!="添加时间"){
        wx.cloud.callFunction({
          name: 'uploademo',
          data: {
            'userOpenid': app.globalData.openid,
            'imgPath': '',
            'emotion': that.data.emotionText,
            'time': date,
            'label' : that.data.selectFeeling,
            'detail': that.data.nowdetail,
            'mode' : that.data.mode
          }
        }).then(function(res) {
          console.log("【调用函数uploademo】【保存成功】", res)
        }).catch(function(err) {
          console.log(err)
          wx.showToast({
            title: '保存失败',
          })
        })
      }
      else{
        wx.showToast({
          title: '时间不能为空',
        })
      }
      
    }
  }, 
//点击获取当前点击时间
  getTime: function () {
     let that = this;
     let currentTime = util.formatTime(new Date());
     that.setData({
       nowtime: currentTime
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