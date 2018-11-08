! function() {
    var menu = $('#menu')
    var next = menu.next()
    var content = $('.areabox')
    var win = $(window)
    var doc = $(document)
    var fn = null
    var tab = menu.find('a')
    var top = menu.offset().top
    var height = menu.height()

    menu.on('click', 'a', function(e) {
        e.preventDefault()
        var _index = $(this).index()
        scrollMoveTo(_index)
        tabSelect(_index)
    })

    function scrollMoveTo(n) {
        $('body,html').animate({
            "scrollTop": content.eq(n).offset().top
        }, 300);
    }

    function tabSelect(n) {
        tab.removeClass('on').eq(n).addClass('on')
    }

    function check() {
        clearTimeout(fn)
        fn = setTimeout(function() {
            var st = win.scrollTop()
            content.each(function(index, element) {
                if (content.eq(index).offset().top + content.eq(index).height() >= st+height) {
                    tabSelect(index)
                    return false
                }
            })
            if (st >= top) {
                menu.addClass('fixedmenu')
                next.css({
                    "margin-top": height
                })
            } else {
                menu.removeClass('fixedmenu')
                next.css({
                    "margin-top": 0
                })
            }
        }, 30)
    }
    check()

    win.scroll(check).resize(check)
}()
