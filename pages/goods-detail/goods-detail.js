import request from "../../request/network";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {}, //获取数据很多用不到的，所以创建此对象接收自定义属性值
        //商品是否被收藏过
        isFavorite: false
    },
    //商品对象
    goodsInfoObj: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
        //options接收页面路径参数传递

        let pages = getCurrentPages();
        let curPage = pages[pages.length - 1];
        let options = curPage.options

        const { goods_id } = options
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

            //获取缓存商品收藏数组
            let favorite = wx.getStorageSync('favorite') || [];
            //判断当前商品是否被收藏
            let isFavorite = favorite.some(v => v.goods_id == this.goodsInfoObj.goods_id)

            this.setData({
                goodsObj: {
                    goods_name: res.data.message.goods_name,
                    goods_price: res.data.message.goods_price,
                    // 替换图片支持苹果系统图片显示
                    goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
                    pics: res.data.message.pics
                },
                isFavorite
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

    },
    //点击收藏
    onClickFavorite() {
        let isFavorite = false;
        // 1 获取缓存中商品收藏数组
        let favorite = wx.getStorageSync('favorite') || [];
        // 2 判断该商品是否被收藏过
        let index = favorite.findIndex(v => v.goods_id == this.goodsInfoObj.goods_id);
        // 3 当index!==-1  表示收藏过
        if (index !== -1) {
            // 已经收藏过 在收藏数组中删除该商品
            favorite.splice(index, 1);
            isFavorite = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });
        } else {
            // 没有被收藏过， 添加收藏数组中
            favorite.push(this.goodsInfoObj);
            isFavorite = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }

        wx.setStorageSync('favorite', favorite);
        this.setData({
            isFavorite
        })


    }

})