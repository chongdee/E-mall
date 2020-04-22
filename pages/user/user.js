// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        //被收藏商品的数量
        favoriteNum: 0
    },

    onShow() {
        const userInfo = wx.getStorageSync('userInfo');
        const favorite = wx.getStorageSync('favorite') || [];

        this.setData({
            userInfo,
            favoriteNum: favorite.length
        })
    }


})