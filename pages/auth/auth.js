// pages/auth/auth.js
import request from "../../request/network";
import { login } from "../../request/mypromise"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: ''
    },
    getCode() {
        //获取小程序登录成功后的code
        login().then(res => {
            const { code } = res
            this.setData({
                code
            })
        })
    },

    //获取用户信息
    onGetUserInfo(e) {
        console.log(e);
        let { code } = this.data;
        console.log(code);

        //获取用户信息
        const { encryptedData, iv, rawData, signature } = e.detail;
        const loginParams = { encryptedData, iv, rawData, signature, code }
            //发送请求
        request({
            url: "/users/wxlogin",
            method: 'POST',
            data: loginParams
        }).then(res => {
            console.log(res);
            const { token } = res
            console.log(token);
            wx.setStorageSync('token', token);
            wx.navigateBack({
                delta: 1
            });

        })

    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getCode()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})