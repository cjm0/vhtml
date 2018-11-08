/**
 * Created by admin on 2017/12/20.
 */



!function(){
    $('.product .return i').mouseenter(function(){
        $(this).parent().find('.tip').show();
    });
    $('.product .return i').mouseleave(function(){
        $(this).parent().find('.tip').hide();
    });

    $("#elevator1").mouseover(function(){
        $('#elevator5').addClass('show').removeClass('hidden')
    })
    $("#elevator1").mouseout(function(){
        $('#elevator5').addClass('hidden').removeClass('show')
    })
    $("#elevator2").mouseover(function () {
        $('#elevator4').addClass('show').removeClass('hidden')
    })
    $("#elevator2").mouseout(function () {
        $('#elevator4').addClass('hidden').removeClass('show')
    })

    $("#elevator3").click(function () {
        window.scrollTo(0,0)
    })
    $(".en-mainpart2 .p span").click(function(){
        $("#mask").css('display','block')
        $("#box").css('display','block')
    })
    $("#closebox").click(function(){
        $("#mask").css('display','none')
        $("#box").css('display','none')
    })

    $.ajax({
        url:location.protocol+'//m.jindanlicai.com/Share_news/get_news_list',
        dataType: 'jsonp',
        timeout: 15000,
        data:{limit:2},
        success:function(response){
            $('.en-mainpart4 dd').each(function(index,value){
                $(this).find('.title').text(response.list[index]['title'])
                $(this).find('.date').text(response.list[index]['report_time'].split(" ")[0])
                $(this).find('.from').text(response.list[index]['medium'])
                $(this).find('p').text(response.list[index]['medium_content'])
                $(this).find('a').attr('href',response.list[index]['medium_url'])
            })
            $(".en-mainpart4 dl dt img").each(function(index,value){
                $(this).attr('src',response.list[index]['title_img'])
            })
        }
    })
    $.ajax({
        url: location.protocol + '//xwm.jindanlicai.com/new_data_chart/www_chart',
        dataType: 'jsonp',
        success: function(result) {
            beginCountUp(result)
            typeof(_init)=='function'&&_init(result)
        }
    })

    function beginCountUp(data) {
        numUp("entotalmoney", Math.round(data['total_money'] / 100), 2000,1);
        numUp("entotalpeople", Math.round(data["user_count"].data), 2000);
        //numUp("entotalpeople", Math.round('1234567'), 2000);
    }
    function numUp(id, num, time, type) {
        var el = document.getElementById(id)
        var step = 160
        var _step = 0
        var time = time || 3000
        var timeOut = null
        var base = Math.floor(time / step)
        var len = (num + "").length

        function easeOutExpo(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        }

        function linear(t, b, c, d) {
            return c * t / d
        }

        function numFormat(n) {
            var str = n + ""
            var arr = []
            var prefix = ['<em>亿</em>', '<em>万</em>', '']
            for (var i = 0; i < len; i++) {
                var l = len - i - 1;
                (i % 4 == 0) && arr.push(prefix.pop())
                typeof(str[l]) == 'undefined' ? arr.unshift('<span>' + 0 + '</span>'): arr.push('<span>' + str[l] + '</span>')
            }
            if(type){
                arr = arr.slice(5)
            }
            return arr.reverse().join('')
        }

        function count() {
            _step++
            if (step >= _step) {
                timeOut = setTimeout(function() {
                    var cur = Math.round(easeOutExpo(_step, 0, num, step))
                    el.innerHTML = numFormat(cur)
                    count()
                }, easeOutExpo(_step, 0, base, step))
            } else {
                clearTimeout(timeOut)
            }
        }
        count()
    }
}()