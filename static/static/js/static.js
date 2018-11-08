! function(window, document, option, openName, tongji, globalName) {
    option = option || {}
    globalName = 'JindanGlobalStatistics'
    openName = window[globalName] || globalName
    tongji = window[openName] || []

    function extend(obj, _obj) {
        if (Object.assign) {
            return Object.assign(obj, _obj)
        } else {
            for (key in _obj) {
                obj[key] = _obj[key]
            }
            return obj
        }
    }

    function push(obj) {
        obj = extend(obj || {}, option)
        var img = new Image()
        img.src = object2url(obj)
    }

    function object2url(obj) {
        var tmp = []
        for (var key in obj) {
            tmp.push([key, encodeURIComponent(obj[key])].join('='))
        }
        return '//statistics.jindanlicai.com/s.png?' + tmp.join('&')
    }

    function init() {
        for (var i = 0; i < tongji.length; i++) {
            push(tongji[i])
        }
        window[openName] = { push: push }
    }
    init()
}(window, document, {})
