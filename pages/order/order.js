// pages/order/order.js
/*
页面打开 触发onShow生命函数
  onShow options无法像onLoad获取在页面跳转过来的参数,解决方法通过getCurrentPages获取当前页面

*/

import request from '../../request/network'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        tabs: [
            { id: 0, name: '全部', isActive: true },
            { id: 1, name: '待付款', isActive: false },
            { id: 2, name: '待发货', isActive: false },
            { id: 3, name: '退款/退货', isActive: false }
        ],
    },

    //点击标题自定义事件，从组件传递索引过来
    onTabsChange(e) {
        let { index } = e.detail
        this.changeTitleByIndex(index);
        //重新发送请求 type=1, index=0
        this.getOrders(index + 1)
    },
    changeTitleByIndex(index) {
        // 修改原数组
        let { tabs } = this.data
        tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
        this.setData({
            tabs
        })
    },

    getOrders(type) {
        request({
            url: 'orders/all',
            data: { type }

        }).then(res => {
            console.log(res);
            this.setData({
                orders: res.orders
            })
        })
    },
    onShow(options) {
        // 判断是否有token,没有跳转到授权页面
        const token = wx.getStorageSync('token');
        // if (!token) {
        //     wx.navigateTo({
        //         url: '/pages/auth/auth',
        //         success: (result) => {

        //         }
        //     });
        //     return;
        // }
        console.log(options);
        //获取当前小程序的页面栈--数组，长度最大是10个页面
        //数组中 索引最大的页面就是当前页面
        let Pages = getCurrentPages();
        console.log(Pages);
        let curPage = Pages[Pages.length - 1];
        console.log(curPage.options);

        const { type } = curPage.options;

        this.getOrders(type);
        //激活选中页面标题
        this.changeTitleByIndex(type - 1)

    }
})