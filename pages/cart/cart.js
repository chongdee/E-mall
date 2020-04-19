//Page Object
/*
获取收货地址
 1.假设用户点击收货地址wx.chooseAddress提示框的确定scope值：  authSetting: {scope.address: true(取消为false)} 
 2.如果用户没有调用wx.chooseAddress,直接调用wx.getSetting,scope值undefined： authSetting: {scope.address: undefined}

wx.openSetting打开获取地址授权
 */
Page({
    data: {
        address: {},
        cart: [],
        CheckedAll: false,
        totalPrice: 0,
        totalNum: 0
    },
    //收货地址
    onChooseAddr() {
        // 如果第一次点击了授权取消，下次再点收货地址按钮没有响应
        // wx.chooseAddress({
        //     success: (res) => {
        //         console.log(res);

        //     }
        // })
        wx.getSetting({
            success: (res) => {
                console.log(res);
                let isScopeAddr = res.authSetting['scope.address']
                if (isScopeAddr == true || isScopeAddr == undefined) {
                    wx.chooseAddress({
                        success: (res1) => {
                            console.log(res1);
                            // 把获取到的地址存储到本地存储中
                            wx.setStorageSync('address', res1);
                        }
                    });
                } else {
                    // 用户拒绝过授权， 先诱导用户打开授权页面
                    wx.openSetting({
                        success: (res2) => {
                            console.log(res2);
                            // 用户开启地址授权 可以调用收货地址接口
                            wx.chooseAddress({
                                success: (res3) => {
                                    console.log(res3);
                                    // 把获取到的地址存储到本地存储中
                                    wx.setStorageSync('address', res3);
                                }
                            });
                        }
                    });
                }
            }
        });

    },
    //商品的选中
    onItemChecked(e) {
        // 获取被修改的商品id
        let goods_id = e.currentTarget.dataset.id
            // 获取购物车数组
        let { cart } = this.data
            // 找到被修改的商品对象的索引
        let index = cart.findIndex(v => v.goods_id == goods_id);
        // 选中状态取反
        cart[index].checked = !cart[index].checked

        this.setCart(cart)
    },
    // 工具栏全选
    onCheckAll() {
        // 获取data中的数据
        let { cart, CheckedAll } = this.data;
        CheckedAll = !CheckedAll
            //循环遍历商品项中的选中状态
        cart.forEach(v => v.checked = CheckedAll)
            //把修改后的状态重新赋值data 或 缓存中
        this.setCart(cart)
    },
    // 数量操作
    onNumOperate(e) {

        // 获取页面data-*属性传递过来的参数,加1设置data-operate值为1，减1为-1
        let { operate, id } = e.currentTarget.dataset
        console.log(operate, id);
        // 获取购物车数组
        let { cart } = this.data;
        // 通过goods_id找到数组索引
        let index = cart.findIndex(v => v.goods_id == id);
        //当数量为1时再点击减号弹窗提示
        if (cart[index].num == 1 && operate == -1) {
            wx.showModal({
                title: '提示',
                content: '您是否要删除？',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (res) => {
                    if (res.confirm) {
                        cart.splice(index, 1);
                        this.setCart(cart)
                    } else if (res.cancel) {
                        console.log('用户点击取消');

                    }
                }
            });
        } else {
            // 进行数量修改
            cart[index].num += operate;
            // 计算数量后设置回缓存或data中
            this.setCart(cart);
        }


    },
    //结算操作
    onPay() {
        let { address, totalNum } = this.data
        if (!address.userName) {
            wx.showToast({
                title: '您还没有选择收货地址!',
                icon: 'none',
                success: (result) => {

                }
            });
            return;
        }
        if (totalNum == 0) {
            wx.showToast({
                title: '您还没有选购商品!',
                icon: 'none',
                success: (result) => {

                }
            });
            return
        }
        wx.navigateTo({
            url: '/pages/pay/pay'
        });
    },
    //选中商品设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 总数量
    setCart(cart) {
        let CheckedAll = cart.length ? cart.every(v => v.checked) : false;

        // 总价格，总数量
        let totalPrice = 0;
        let totalNum = 0;
        // 计算总价格，总数量
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num
            }
        });
        //商品选中重新计算总价格，总数量,全选状态

        this.setData({
            cart,
            totalPrice,
            totalNum,
            CheckedAll
        })

        // 把购物车数据重新设置回data中和缓存中
        wx.setStorageSync('cart', cart);
    },
    //options(Object)
    onLoad: function(options) {

    },
    onReady: function() {

    },
    onShow: function() {
        //获取缓存中的收货地址信息
        let address = wx.getStorageSync('address');

        // 获取缓存中的购物车数据(详情页点击加入购物车缓存的数据)
        let cart = wx.getStorageSync('cart') || [];
        this.setCart(cart);
        this.setData({ address })
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