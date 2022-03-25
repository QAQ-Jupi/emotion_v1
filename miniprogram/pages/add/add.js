// pages/add/add.js
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

  },

  //点击‘手动操作’触发事件，将mode改为0
  manualMode: function(){
    this.setData({
      mode: 0
    })
    this.EmotionChange()
  },  
  //点击‘实时扫描’触发事件，将mode改为1
  realtimeMode: function(){
    this.setData({
      mode: 1
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
    // console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var diffShowFeeling = JSON.parse(JSON.stringify(this.data.neutral)) //深拷贝
    this.setData({
      showFeeling: diffShowFeeling
    })
    console.log(this.data.showFeeling)
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