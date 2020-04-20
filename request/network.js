let requestTimes = 0; //请求次数
export default function request(options) {
    requestTimes++;
    //显示加载中
    wx.showLoading({
        title: '加载中',
        mask: true,

    });
    const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1';
    return new Promise((reslove, reject) => {
        wx.request({
            url: baseURL + options.url,
            data: options.data || {},
            header: options.header || { 'content-type': 'application/json' },
            method: options.method || 'GET',
            dataType: options.dataType || 'json',
            responseType: options.responseType || 'text',
            success: (res => {
                reslove(res)
            }),
            fail: (err => {
                reject(err)
            }),
            complete: () => {
                requestTimes--;
                if (requestTimes == 0) {
                    wx.hideLoading();
                }

            }
        });
    })
}