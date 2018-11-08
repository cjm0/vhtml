/**
 * Created by admin on 2017/12/22.
 */
!function(){
    $.ajax({
        url: 'https://bm.jindanlicai.com/information/preview',
        dataType: 'jsonp',
        success: function (response) {
           // console.log(response);
            var dataList = response['information_data'];
            var borrowList = response['borrower_data'];
            var list = ['exchange_amount', 'total_count', 'total_lender', 'current_lender', 'total_borrower', 'current_borrower', 'relation_count', 'relation_balance', 'past_count', 'nine_amount', 'nine_count', 'loan_amount', 'loan_count', 'overdue'];
            for (var i = 0; i < list.length; i++) {
                $('#' + list[i]).text(dataList[list[i]])
            }

            //特殊处理的
            var amount = formatData(dataList['total_amount'])
            var net_amount = formatData(dataList['net_amount'])
            var exchange_amount = formatData(dataList['exchange_amount'])
            $('#total_amount').text(amount)
            $('#net_amount').text(net_amount)
            $('#exchange_amount').text(exchange_amount)

            $('#spe').find('tr').each(function (index, value) {
                var tdData = borrowList[index];
                $(this).find('td').each(function (index, value) {
                    if (index == 0) {
                        $(this).text(tdData.user_name)
                    } else if (index == 1) {
                        $(this).text(tdData.return_amount)
                    } else {
                        $(this).text(tdData.amount_proportion)
                    }
                })
            })

            var deadline = (dataList['valid_date'] ||'2017-12-31').split('-');
            var linetext = deadline[0] + '年' + deadline[1] + '月' + deadline[2] + '日'
            //有用，勿删
            $('#deadline').text(linetext)

        }
    })

    $.ajax({
        url: location.protocol + '//xwm.jindanlicai.com/new_data_chart/www_chart',
        dataType: 'jsonp',
        success: function (result) {
            var money = formatData(result['total_money'], 1)
            var days = result['operate_days']
            $('#total_money').text(money)
            $('#operate_days').text(days)

        }
    })

    function formatData(data,type){
        var data2;
        if(type){
            data2 = (data / 10000000000).toFixed(4).split('.')
        }else{
            data2 = (data / 100000000).toFixed(4).split('.')
        }
        return data2[0]+'亿'+data2[1]+'万'
    }

    $('#inkey').mouseover(function () {
        $('#net_tips .words').addClass('show').removeClass('notshow')
    });
    $('#inkey').mouseout(function () {
        $('#net_tips .words').addClass('notshow').removeClass('show')
    });

}()
