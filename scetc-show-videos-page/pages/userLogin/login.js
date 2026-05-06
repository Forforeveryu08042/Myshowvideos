const app = getApp()
Page({
  data: {
    realUrl: '',
    nickName: '',//用户的名称
    avatarUrl: '', //用户的头像
    saveUserInfo: { username: "", password: "" }
  },
  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    //简单验证
    if (username.length == 0 || password.length == 0) {   //反馈数据
      wx.showToast({
        title: '小主,用户名和密码不能为空哦',
        icon: 'none',//图标
        duration: 3000
      })
    }
    else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      })
      var requestData = JSON.stringify({
        username: username,
        password: password
      });
      wx.request({
        url: serverUrl + 'login',
        method: "POST",
        data: requestData,
        header:
        {
          'content-type': 'application/json'//默认值
        },
        timeout: 30000,
        success: function (res) {
          var status = res.data && res.data.status;
          if (status == 200) {
            wx.hideLoading();
            wx.showToast({
              title: '小主,登陆成功啦',
              icon: 'none',
              duration: 3000
            })
            var saveUserInfo = me.data.saveUserInfo;
            saveUserInfo.password = password;
            saveUserInfo.username = username;
            app.saveUserInfo(saveUserInfo);
            app.setGlobalUserInfo(res.data.data);
            var realUrl = me.data.realUrl;
            console.log("realUrl"+realUrl);
            realUrl = app.globalData.realUrl;
            console.log("publisherId" + app.globalData.publisherId);
            if (realUrl == ''||realUrl==null) {
              //跳转
              wx.switchTab({
                url: '../mine/mine',
              })
            }
            else {
              wx.redirectTo({
                url: realUrl
              })
            }
          }
          else if (status == 500) {
            wx.hideLoading();
            wx.showToast({
              title: (res.data && res.data.msg) ? res.data.msg : '登录失败',
              icon: 'none',
              duration: 3000
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '服务器异常或未返回 JSON',
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showToast({
            title: (err && err.errMsg) ? err.errMsg : '网络失败，请确认 mini-api 已启动',
            icon: 'none',
            duration: 4000
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    var me = this;
    var rawData = JSON.parse(e.detail.rawData);
    var nickName = rawData.nickName;
    var avatarUrl = rawData.avatarUrl;
  },
  goRegist: function () {
    wx.navigateTo({
      url: '../userRegist/regist',
    })
  },
  onLoad: function (e) {
    console.log("result："+app.globalData.realUrl);
    var me = this;
    var realUrl = e.realUrl;
    console.log(realUrl);
    if (realUrl != null && realUrl != '' && realUrl != undefined) {
      realUrl = realUrl.replace('@', '=');
      realUrl = realUrl.replace('#', '?');
      //../videoinfo/videoinfo#videoInfo@[object Object]
      console.log("真实的路径" + realUrl);
      me.setData(
        {
          realUrl: realUrl
        }
      )
    }
    var user = app.getSaveUserInfo() || {};
    var username = user.username;
    var password = user.password;
    if (username != null && username != undefined && username != '' && password != null && password != undefined
      && password != '') {
      me.setData(
        {
          username: username,
          password: password
        }
      )
    }

  }
})