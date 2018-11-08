!function(){
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
}()
