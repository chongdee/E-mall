import request from "../../request/network";
/*
滚到底部加载下一页数据
1.获取总页数
    总页数 = 总条数(total)/每一页条数(pagesize)
    Math.ceil(总条数(total)/每一页条数(pagesize))
*/
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            { id: 0, name: '综合', isActive: true },
            { id: 1, name: '销量', isActive: false },
            { id: 2, name: '价格', isActive: false }
        ],
        goodsList: []
    },
    //接口参数
    queryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10
    },
    //总页数
    totalPages: 1,


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // options能拿到上页跳转传递过来的页面参数{cid: "5"}
        console.log(options);
        this.queryParams.cid = options.cid
        this.getGoodsList()
    },
    // ---------------------事件监听函数---------------------------
    //点击标题自定义事件，从组件传递索引过来
    onTabsChange(e) {
        let { index } = e.detail
            // 修改原数组
        let { tabs } = this.data
        tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
        this.setData({
            tabs
        })
    },
    //获取商品列表数据
    getGoodsList() {
        request({
            url: '/goods/search',
            data: this.queryParams

        }).then(res => {
            console.log(res);
            // 获取总条数
            let { total } = res.data.message
                // 计算总页数
            this.totalPages = Math.ceil(total / this.queryParams.pagesize)
            console.log(this.totalPages);

            this.setData({
                // goodsList: res.data.message.goods
                goodsList: [...this.data.goodsList, ...res.data.message.goods] //数组拼接
            })

            //关闭下拉刷新窗口
            wx.stopPullDownRefresh()

        })
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
        // 重置数组
        this.setData({
            goodsList: []
        });
        // 重置页码
        this.queryParams.pagenum = 1;
        //发送网络请求
        this.getGoodsList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log('页面触底');
        // 判断还有没有下一页数据
        if (this.queryParams.pagenum >= this.totalPages) {
            console.log('没有下一页');
            wx.showToast({
                title: '没有下一页',
                icon: 'none',

            });

        } else {
            console.log('还有下一页');
            this.queryParams.pagenum++;
            this.getGoodsList();
        }

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})