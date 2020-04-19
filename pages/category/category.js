// pages/category/category.js
import request from "../../request/network";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //左侧菜单数据
        menuList: [],
        //右侧商品数据
        contentList: [],

        //设置被点击的左侧菜单索引
        currentIndex: 0,
        //右侧内容滚动条到顶部距离
        scrollTop: 0

    },
    // 接口返回的数据
    cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /*
      
        */
        const cates = wx.getStorageSync("cates");

        if (!cates) {
            // 不存在数据， 发送请求
            this.getCateData()
        } else {
            // 有旧数据  定义过期时间5分钟 ，如果过5分钟 重新发请求
            if (Date.now() - cates.time > 1000 * 10 * 300) {
                // 重新发请求
                this.getCateData()
            } else {
                //可以使用旧数据
                this.cates = cates.data //获取本地存储的数据
                let menuList = this.cates.map(item => item.cat_name)
                let contentList = this.cates[0].children
                this.setData({
                    menuList,
                    contentList
                })
                console.log('可以使用旧的数据');

            }
        }

    },

    // ----------------------------网络请求函数----------------------------
    //  获取分类数据
    getCateData() {
        request({
            url: '/categories'
        }).then(res => {
            console.log(res);
            this.cates = res.data.message

            //获取到的数据存储到本地存储中
            wx.setStorageSync('cates', { time: Date.now(), data: this.cates });


            // 通过map遍历分拆数据存入左侧菜单
            let menuList = this.cates.map(item => item.cat_name)
                // 通过map遍历分拆数据存入右侧商品内容
            let contentList = this.cates[0].children
            this.setData({
                menuList,
                contentList
            })
        })
    },
    // ----------------------------事件监听函数----------------------------
    onItemTap(e) {

        /*
        1.获取被点击标题的索引  通过data-index属性获取
        2.给data中的currentIndex赋值
        3.根据不同的索引渲染右侧商品内容
        */
        let { index } = e.currentTarget.dataset
            // 根据不同的索引渲染右侧商品内容
        let contentList = this.cates[index].children
        this.setData({
            currentIndex: index,
            contentList,
            scrollTop: 0 //重置内容滚动条到顶部距离
        })
    }
})