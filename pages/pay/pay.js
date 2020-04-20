//Page Object
import request from '../../request/network';
import { requestPayment } from '../../request/network';
Page({
    data: {
        cart: [],
        address: {},
        totalPrice: 0,
        totalNum: 0,
    },
    onShow: function() {
        //获取缓存中的收货地址信息
        let address = wx.getStorageSync('address');

        // 获取缓存中的购物车数据(详情页点击加入购物车缓存的数据)
        let cart = wx.getStorageSync('cart') || [];
        //过滤后的购物车数组
        cart = cart.filter(v => v.checked)
        console.log(cart);

        // 总价格，总数量
        let totalPrice = 0;
        let totalNum = 0;
        // 计算总价格，总数量
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num
        });

        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
    },
    //点击支付
    onOrderPay() {
        //判断缓存中是否有token
        const token = wx.getStorageSync('token');
        //判断是否有token
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/auth',
                success: (result) => {

                }
            });
            return;
        }
        console.log('已经存在token');

        //创建订单，请求头参数
        const header = { Authorizetion: token };
        //请求体参数
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address;
        const cart = this.data.cart

        let goods = [];

        cart.forEach(v => goods.push({
            goods_id: v.goods_id,
            goods_number: v.num,
            goods_price: v.goods_price
        }))

        const orderParams = { order_price, consignee_addr, goods }

        //发送请求
        request({
            url: '/orders/create',
            method: 'POSt',
            data: orderParams,
            header
        }).then(res => {
            // 获取订单编号 order_number
            console.log(res);
            const { order_number } = res

        }).then(res => {
            //发起 预支付接口
            request({
                url: '/orders/req_unifiedorder',
                method: 'POSt',
                data: order_number,
                header
            }).then(res => {
                // 根据order_number返回pay
                console.log(res);
                const { pay } = res;
            })
        }).then(res => {
            // 发起微信支付
            requestPayment(pay).then(res => {
                console.log(res);


            })

        })


        //查询后台 订单状态
        request({
            url: '/orders/chkOrder',
            method: 'POSt',
            data: order_number,
            header
        }).then(res => {

            console.log(res);

        })

        wx.showToast({
            title: '支付成功',
        });

        //手动删除缓存中 已经支付过的商品
        let newCart = wx.getStorageSync('cart');
        //过滤没有被选中的
        newCart = newCart.filter(v => !v.checked)
        wx.setStorageSync('cart', newCart);

        // 支付成功，跳转到订单页面
        wx.navigateTo({
            url: '/pages/order/order'
        });


    },

});