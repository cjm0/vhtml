! function() {
    function getUrl() {
        var url = location.search,
            g = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1),
                arr = str.indexOf("&") != -1 ? str.split("&") : [str];
            for (var i = 0; i < arr.length; i++) {
                var tmp = arr[i].split("=");
                g[tmp[0]] = decodeURI(tmp[1]);
            }
        }
        return g;
    }

    var menu = $('.m-menu').find('dl')
    var content = $('.m-content').children()
    var index = getUrl().index
    var length = menu.length

    function show(_index) {
        menu.removeClass('on').eq(_index).addClass('on')
        content.addClass('none').eq(_index).removeClass('none')
    }

    menu.click(function(event) {
        show($(this).index())
    })
    if(!isNaN(index)&&index<length){
    	show(Math.abs(index))
    }
}()
