/*
this.$jsonp({
    url: 'http://m.jindanlicai.com/Share_news/get_news_list',
    data: {
        limit: 2
    },
    timeout: 1500,
})
.then(res => {
    
})
.catch(err => {
    
})
*/

// 格式化参数
let formatParams = (data) => {
    if (typeof data == 'string') {
        return data
    }
    let arr = [];
    for (let name in data) {
        arr.push([encodeURIComponent(name), encodeURIComponent(data[name])].join('='));
    };
    // 添加一个随机数，防止缓存
    return arr.join('&');
}

// 格式化请求URL
let formatUrl = (url, string) => [url, string].join(/\?/g.test(url) ? '&' : '?')

// 生成JSONP name
let jsonpCallback = (params) => {
    let jsonpName
    if (params.jsonpCallback) {
        jsonpName = params.jsonpCallback
    } else {
        jsonpName = ['jsonpCallback', Math.random().toString().replace('.', ''), (new Date()).getTime()].join('_')
    }
    return jsonpName
}

export default (params = {}) => {
    params.data = params.data || {};

    let promise = new Promise((resolve, reject) => {
        // 创建script标签并加入到页面中
        let callbackName = jsonpCallback(params);
        let head = document.getElementsByTagName('head')[0];

        // 设置传递给后台的回调参数名
        params.data['callback'] = callbackName;
        let data = formatParams(params.data);
        let script = document.createElement('script');
        head.appendChild(script);

        // 创建jsonp回调函数
        window[callbackName] = function(json) {
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            resolve(json)
        };

        // 发送请求
        script.src = formatUrl(params.url, data);

        // 超时处理
        if (params.timeout) {
            script.timer = setTimeout(function() {
                window[callbackName] = null;
                head.removeChild(script);
                reject({
                    message: '超时'
                })
            }, params.timeout);
        }
    })
    return promise
}