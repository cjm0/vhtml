import './common.less'


let Cookie = {
    read(name) {
        let value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return (value) ? decodeURIComponent(value[1]) : null;
    },
    write(value) {
        let str = value.name + '=' + encodeURIComponent(value.value);
        if (value.domain) {
            str += '; domain=' + value.domain;
        }
        if (value.path) {
            str += '; path=' + value.path;
        }
        if (value.day) {
            let time = new Date();
            time.setTime(time.getTime() + value.day * 24 * 60 * 60 * 1000);
            str += '; expires=' + time.toGMTString();
        }
        document.cookie = str;
    },
    dispose(name) {
        let str = this.read(name);
        this.write({
            name: name,
            value: str,
            day: -1
        });
    }
}
window.cookie = (name, value, options) => {
    if (typeof value === 'undefined') {
        return Cookie.read(name);
    } else {
        if (value === null) {
            return Cookie.dispose(name);
        } else {
            options = options || {};
            options.name = name;
            options.value = value;
            return Cookie.write(options);
        }
    }
}

// Browser environment 
let inBrowser = typeof window !== 'undefined';
let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
let UA = inBrowser && window.navigator.userAgent.toLowerCase();
window.config = {
    load: null,
    system: {
        isIE: UA && /msie|trident/.test(UA),
        isWeixin: UA.indexOf('micromessenger') > -1,
        isApp: UA.indexOf('jindanlicai') > -1,
        isIOS: (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios'),
        isAndroid: (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android'),
        isIphoneX: /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
    }
}









