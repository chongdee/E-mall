export const login = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                timeout: 10000,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err)
                }
            });
        })
    }
    // 发起支付请求
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: '',
            paySign: '',
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });
    })
}