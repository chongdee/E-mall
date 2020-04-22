// pages/feedback/feedback.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            { id: 0, name: '体验问题', isActive: true },
            { id: 1, name: '商品、商家投诉', isActive: false },
        ],
        goodsList: [],
        chooseImgs: [],
        textAreaVal: ''
    },
    // 外网图片的路径数组
    upLoadImgs: [],
    //选择图片
    onChooseImg() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                console.log(res);
                this.setData({
                    //图片数组 进行拼接
                    chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
                })
            }
        });
    },
    //点击图片删除
    onRemoveImg(e) {
        //通过data-*属性获取页面索引
        const { index } = e.currentTarget.dataset
        let { chooseImgs } = this.data

        chooseImgs.splice(index, 1)

        this.setData({
            chooseImgs
        })
    },
    //文本域输入事件
    onTextVal(e) {
        this.setData({
            textAreaVal: e.detail.value
        })
    },
    //点击按钮提交事件
    onSubmit() {
        const { textAreaVal, chooseImgs } = this.data
        if (!textAreaVal.trim()) {
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
            return;
        }

        wx.showLoading({
            title: '正在上传',
            mask: true,
        });
        //上传图片,上传文件API不支持 多个文件同时上传，所以只能遍历数组，逐个上传

        chooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    //文件上传的路径
                    url: 'http://images.ac.cn/api/upload',
                    // 被上传的文件路径
                    filePath: v,
                    // 上传文件的名称， 后台来获取文件
                    name: 'file',
                    // 顺带的文本信息
                    formData: {},
                    success: (res) => {
                        console.log(res);

                    }
                });

            })
            //模拟上面上传图片成功后页面跳转
        if (textAreaVal) {

            setTimeout(() => {
                wx.hideLoading();
            }, 3000);
            wx.navigateBack({
                delta: 1
            });
        }

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
})