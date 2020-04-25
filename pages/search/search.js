// pages/search/search.js
// 函数防抖  定时器
// 1 防抖 一般  作用在输入框中 防止重复输入 重复发送请求
// 2 节流 一般用在页面上拉和下拉

import request from '../../request/network'
Page({

    data: {
        goods: [],
        //取消按钮是否显示
        isShowCancelBtn: false,

        // 输入框的值
        inptVal: ''
    },
    TimeId: -1,
    //输入框事件
    onInput(e) {
        console.log(e);
        const { value } = e.detail;
        if (!value.trim()) {
            this.setData({
                goods: [],
                isShowCancelBtn: false
            })
            return;
        }
        //取消按钮显示
        this.setData({
                isShowCancelBtn: true
            })
            //防抖避免输入框每输入一个文字发送一次请求
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value)

        }, 1000);


    },

    qsearch(query) {
        request({
            url: '/goods/qsearch',
            data: { query }
        }).then(res => {
            console.log(res);
            let goods = res.data.message
            this.setData({
                goods
            })

        })
    },
    // 点击取消按钮
    onCancel() {
        this.setData({
            inptVal: '',
            isShowCancelBtn: false,
            goods: []
        })
    }

})