const app = getApp()

Page({
  data: {

  },
  doRegist: function(e) {
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    //简单验证
    if (username.length == 0 || password.length == 0) { //反馈数据
      wx.showToast({
        title: '用户名或者密码不能为空',
        icon: 'none', //图标
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      })
      var requestData = JSON.stringify({
        username: username,
        password: password
      });
      console.log('[regist] 发送注册请求 -> url:', serverUrl + 'regist', 'data:', requestData);
      wx.request({
        url: serverUrl + 'regist',
        method: "POST",
        data: requestData,
        header: {
          'content-type': 'application/json' //默认值
        },
        timeout: 30000,
        success: function(res) {
          wx.hideLoading();
          console.log('[regist] 服务器响应 -> statusCode:', res.statusCode, 'data:', JSON.stringify(res.data));
          var status = res.data && res.data.status;
          if (status === 200) {
            wx.showToast({
              title: '注册成功啦~~',
              icon: 'none',
              duration: 3000
            })
            app.setGlobalUserInfo(res.data.data);
            app.saveUserInfo({
              username: username,
              password: password
            });
            wx.navigateTo({
              url: '../userLogin/login',
            })
          } else if (status === 500) {
            wx.showToast({
              title: (res.data && res.data.msg) ? res.data.msg : '注册失败',
              icon: 'none',
              duration: 3000
            })
          } else {
            wx.showToast({
              title: '服务器返回异常，请查看 mini-api 控制台',
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: function(err) {
          wx.hideLoading();
          console.error('[regist] 请求失败 ->', JSON.stringify(err));
          wx.showToast({
            title: (err && err.errMsg) ? err.errMsg : '网络请求失败，请确认 8080 与开发者工具本地设置',
            icon: 'none',
            duration: 4000
          })
        }
      })
    }
  },
  goLoginPage: function() {
    wx.navigateTo({
      url: '../userLogin/login',
    })
  }
})