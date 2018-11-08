/**
 * Created by admin on 2017/12/16.
 */
var menu = $('.in-menu').find('dl')
var ullist = $('.in-menu').find('ul')
var lilist = $('.in-menu').find('li')
// var index = getUrl().index
var length = menu.length

function show(_index) {
    menu.removeClass('on').eq(_index).addClass('on')
    ullist.removeClass('show_ul').eq(_index).addClass('show_ul')
}

menu.click(function(event) {
    show($(this).index())
})
ullist.click(function(event){

})