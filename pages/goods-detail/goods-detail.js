import request from "../../request/network";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {}
    },

    goodsInfoObj: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let { goods_id } = options
        this.getGoodsDetail(goods_id)
    },
    // 获取商品详情数据
    getGoodsDetail(goods_id) {
        request({
            url: '/goods/detail',
            data: { goods_id }
        }).then(res => {
            console.log(res);
            this.goodsInfoObj = res.data.message
            console.log(this.goodsInfoObj);

            this.setData({
                goodsObj: {
                    goods_name: res.data.message.goods_name,
                    goods_price: res.data.message.goods_price,
                    // 替换图片支持苹果系统图片显示
                    goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
                    pics: res.data.message.pics
                }
            })
        })

    },

    // 点击轮播图 放大预览
    onPreviewImg(e) {
        let urls = this.goodsInfoObj.pics.map((v, i) => v.pics_mid);
        let current = e.currentTarget.dataset.url;
        console.log(current);

        wx.previewImage({
            current,
            urls
        });

    },

    // 加入购物车
    onAddtoCart() {
        // 把cart定义成数组
        let cart = wx.getStorageSync('cart') || [];
        // 判断商品对象是否存在购物车数据中
        let index = cart.findIndex(v => v.goods_id == this.goodsInfoObj.goods_id);


        if (index == -1) {
            // 不存在 第一次添加并设置数量num
            this.goodsInfoObj.num = 1;
            this.goodsInfoObj.checked = true; //设置选择状态
            cart.push(this.goodsInfoObj)
        } else {
            // 已经存在购物车数据  执行 num++
            cart[index].num++;
        }

        wx.setStorageSync('cart', cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true,

        });

    }

})