const app = getApp()

Page({
  data: {
    totalPage: 1,
    page: 1,
    videoList: [],
    serverUrl: "",
    screenWidth: 350,
    searchContent: "",
    category: ""
  },
  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    var category = params.id;
    if (category != null && category != '' && category != undefined) {
      me.setData({
        category: category,
      })
    }
    me.setData({
      screenWidth: screenWidth,
    })
    var searchContent = params.search;
    var isSaveRecord = params.isSaveRecord;
    if (isSaveRecord == null || isSaveRecord == '') {
      isSaveRecord = 0;
    }
    if (searchContent != undefined) {
      me.setData(
        {
          searchContent: searchContent
        }
      );
    }
    var page = me.data.page;
    me.getAllVideoList(page, isSaveRecord);
  },
  getAllVideoList: function (page, isSaveRecord) {
    var me = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待...加载中',
    })
    var searchContent = me.data.searchContent;
    var category = me.data.category;
    if (category == null || category === undefined) {
      category = '';
    }
    var url = serverUrl + 'video/showAll?page=' + page + "&isSaveRecord="
      + isSaveRecord + '&category=' + encodeURIComponent(category);
    wx.request({
      url: url,
      method: "post",
      data: {
        videoDesc: searchContent || ''
      },
      header: {
        'content-type': 'application/json'
      },
      timeout: 30000,
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (page == 1) {
          me.setData({ videoList: [] });
        }
        var payload = res.data && res.data.data;
        if (res.data && res.data.status !== 200 || !payload || !payload.rows) {
          wx.showToast({
            title: (res.data && res.data.msg) ? res.data.msg : '加载视频列表失败，请确认 mini-api 与数据库',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        var videoList = payload.rows;
        if (!Array.isArray(videoList)) {
          videoList = [];
        }
        var base = (app.serverUrl || '').replace(/\/+$/, '');
        for (var i = 0; i < videoList.length; i++) {
          var face = videoList[i].face_image;
          if (!face) {
            videoList[i].face_image = base + '/images/dsp.jpg';
          } else if (!/^https?:\/\//i.test(face)) {
            videoList[i].face_image = base + '/' + String(face).replace(/^\/+/, '');
          }
          var cover = videoList[i].coverPath;
          if (!cover) {
            videoList[i].coverPath = base + '/images/dsp.jpg';
          } else if (!/^https?:\/\//i.test(cover)) {
            videoList[i].coverPath = base + '/' + String(cover).replace(/^\/+/, '');
          }
        }
        var newVideoList = me.data.videoList;
        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: payload.total != null ? payload.total : 1,
          serverUrl: app.serverUrl
        });
      },
      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '网络错误或未连上 8080',
          icon: 'none',
          duration: 3000
        });
      }
    })
  },
  onReachBottom: function () {
    var me = this;
    var currentPage = me.data.page;
    var totalPage = me.data.totalPage;
    if (currentPage == totalPage) {
      wx.showToast({
        title: '已经没有视频啦',
        icon: "none"

      })
      return;
    }
    var page = currentPage + 1;
    me.getAllVideoList(page, 0);

  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getAllVideoList(1, 0);
  },
  showVideoInfo: function (e) {
    var me = this;
    var videoList = me.data.videoList;
    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);//获取视频信息对象
    wx.navigateTo({
      url: '../videoInfo/videoInfo?videoInfo=' + videoInfo,
    })
  }

})