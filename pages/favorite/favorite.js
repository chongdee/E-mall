// pages/favorite/favorite.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            { id: 0, name: '商品收藏', isActive: true },
            { id: 1, name: '品牌收藏', isActive: false },
            { id: 2, name: '店铺收藏', isActive: false },
            { id: 3, name: '浏览足迹', isActive: false }
        ],
        favorite: []
    },
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

    onShow() {
        const favorite = wx.getStorageSync('favorite') || [];
        this.setData({
            favorite
        })
    }
})