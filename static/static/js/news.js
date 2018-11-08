! function() {
    var cache = {}

    this.tmpl = function(str, data) {
        var fn = cache[str] ? cache[str] :
            (cache[str] = new Function("data",
                "var p=[];" +
                "p.push('" +
                str
                .replace(/&lt;!--/g, "<!--")
                .replace(/--&gt;/g, "-->")
                .replace(/[\r\t\n]/g, " ")
                .split("<!--").join("\t")
                .replace(/((^|-->)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)-->/g, "',$1,'")
                .split("\t").join("');")
                .split("-->").join("p.push('")
                .split("\r").join("\\'") + "');return p.join('');"))
        return data ? fn(data) : fn
    }
}();

function loadImg() {
    $('img').each(function(index) {
        var _this = $(this)
        var src = _this.attr('_src')
        src && _this.attr('src', src)
    })
}

! function() {
    var list = $('#list')
    var tpl = list.find('script').html()
    var more = $('#more')
    var page = 0
    var isinit = false
    var formLoad = false
    var btnVal = more.html()

    function error(msg) {
        alert(msg)
        more.html(btnVal)
        formLoad = false
        isinit && page--
    }

    function render(arr) {
        var len = arr.length
        if (len) {
            if (isinit) {
                list.append(tmpl(tpl, arr))
            } else {
                isinit = true
                list.html(tmpl(tpl, arr))
            }
            loadImg()
        }
        if (len < 10) {
            more.hide()
        }
    }

    function loadContent() {
        $.ajax({
            url: location.protocol + '//m.jindanlicai.com/Share_news/get_news_list',
            dataType: 'jsonp',
            timeout: 15000,
            data: {
                limit: 10,
                offset: page * 10
            },
            beforeSend: function() {
                formLoad = true
                more.html('请稍等..')
            },
            success: function(result) {
                render(result.list)
                more.html(btnVal)
                formLoad = false
            },
            complete: function(request, stauts) {
                if (stauts == 'timeout') {
                    error('网络超时，请重新操作')
                }
            },
            error: function(request, stauts) {
                if (stauts == 'error') {
                    error('请求错误，请检查网络')
                }
            }
        })
    }

    function init() {
        more.click(function(event) {
            if (!formLoad) {
                page++;
                loadContent()
            }
        });
        loadContent()
    }

    init()
}()
