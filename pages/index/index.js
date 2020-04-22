//index.js
import request from "../../request/network";

//Page Object
Page({
    data: {
        swiperList: [],
        cateNavList: [],
        floorList: []
    },
    //options(Object)
    onLoad: function(options) {
        this.getSwiperData()
        this.cateNavListData()
        this.floorListData()
    },
    // ----------------------------------网络请求数据函数---------------------------------
    // 获取轮播图数据
    getSwiperData() {
        request({
            url: '/home/swiperdata'
        }).then(res => {
            console.log(res);

            let result = res.data.message
                // 接口不一样才作以下替换处理
            result.forEach(v => v.navigator_url = v.navigator_url.replace('main', 'goods-detail'))
            result.forEach(v => v.navigator_url = v.navigator_url.replace('goods_detail', 'goods-detail'))
            this.setData({
                swiperList: result
            })

        })
    },
    // 获取分类导航数据
    cateNavListData() {
        request({
            url: '/home/catitems'
        }).then(res => {
            console.log(res);
            let result = res.data.message;
            //     // 接口不一样才作以下替换处理

            this.setData({
                cateNavList: result
            })

        })
    },
    // 获取楼层数据
    floorListData() {
        request({
            url: '/home/floordata'
        }).then(res => {
            console.log(res);

            this.setData({
                floorList: res.data.message
            })

        })
    },

    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function() {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    }
});