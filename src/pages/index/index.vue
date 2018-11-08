<style lang="less">
    @import '../../assets/mixin';
    .index{
        .img_wrap{
            height: 598px;
            text-align: center;
            .img{
                background: url('./img/en01.png') center 0 no-repeat;
                height: 100%;
                background-size: cover;
            }
        }
        
        .tit{
            color: #333;
            font-size: 40px;
            text-align: center;
            font-weight: 300;
        }

        .datas{
            padding: 115px 0 70px;
            .tit{
                margin-bottom: 50px;
            }
            dl{
                float: left;
            }
            dt{
                width: 600px;
                height: 166px;
                box-sizing: border-box;
                background-size: 100% 100%;
                padding-top: 40px;
                padding-left: 40px;
            }
            dl:nth-of-type(1) dt{
                background-image: url("./img/en02.png");
            }
            dl:nth-of-type(2) dt{
                background-image: url("./img/en03.png");
            }
            dd{
                text-align: center;
                margin-top: 27px;
                font-size: 24px;
                color: @gray;
            }
            span{
                display: inline-block;
                color: #e60012;
                height: 81px;
                line-height: 81px;
                width: 64px;
                text-align: center;
                font-size: 71px;
                background: #f6f6f6;
                margin: 0 2px;
                border-radius: 8px;
            }
            em{
                color: #fff;
                font-size: 24px;
            }
        }

        .bg{
            background: @bg;
            padding-bottom: 80px;
            .product{
                .tit{
                    padding: 115px 0 70px;
                }
                .list_wrap{
                    .list{
                        text-align: center;
                        float: left;
                        width: 380px;
                        height: 600px;
                        margin-right: 30px;
                        border-radius: 10px;
                        background-color: #fff;
                        position: relative;
                        &:last-child{
                            margin-right: 0;
                        }
                        .name{
                            padding-top: 86px;
                            color: #333;
                            font-weight: 500;
                            font-size: 50px;
                        }
                        .msg{
                            margin-top: 25px;
                            color: #202120;
                            font-size: 22px;
                        }
                        .rate1{
                            width: 149px;
                            height: 64px;
                            margin-top: 64px;
                        }
                        .rate2{
                            width: 207px;
                            height: 64px;
                            margin-top: 64px;
                        }
                        .rate3{
                            width: 163px;
                            height: 64px;
                            margin-top: 64px;
                        }
                        .info{
                            margin-top: 18px;
                            color: @gray;
                            font-size: 18px;
                            position: relative;
                            display: flex; 
                            justify-content: center;
                            align-items: center;
                            .icon{
                                width: 18px;
                                height: 18px;
                                line-height: 16px;
                                text-align: center;
                                box-sizing: border-box; 
                                border: 1px solid #999;
                                border-radius: 9px;
                                font-size: 14px;
                                margin-left: 6px;
                                color: #999;
                                cursor: pointer;
                            }
                            .tip{
                                width: 80%;
                                position: absolute;
                                top: 30px;
                                left: 50%;
                                border: 1px solid #e6e6e6;
                                padding: 8px 10px;
                                font-size: 14px;
                                border-radius: 5px;
                                background: #f5f5f5;
                                color: #666;
                                transform: translate(-50%, 0);
                                text-align: left;
                            }
                        }
                        .time{
                            margin-top: 80px;
                            color: #da9d64;
                            font-size: 22px;
                        }
                        .btn{
                            margin-top: 32px;
                            display: inline-block;
                            width: 300px;
                            height: 74px;
                            line-height: 74px;
                            font-size: 25px;
                            background-color: #d9a969;
                            color: #fff;
                        }
                    }
                }
            }

            .news{
                .tit{
                    padding-top: 160px;
                }
                .more{ 
                    margin: 14px 0 66px;
                    .link{
                        float: right;
                        font-size: 20px;
                        color: #2e79f7;
                    }
                }
                .list{
                    margin-bottom: 56px;
                    .img{
                        width: 623px;
                        height: 439px;
                        border-radius: 9px; 
                    }
                    .wrap{
                        margin-top: 122px;
                        width: 575px;
                        height: 317px;
                        box-sizing: border-box;
                        padding-left: 30px;
                        background-color: #fff;
                        border-radius: 9px;
                    }
                    .cont{
                        font-size: 20px;
                        .name{
                            padding-top: 42px;
                            color: #363636;
                            font-size: 36px;
                            font-weight: 500;
                            line-height: 1.5;
                        }
                        .from{
                            margin-top: 10px;
                            color: @gray;
                            font-size: 20px;
                        }
                        .text{
                            width: 518px;
                            height: 85px;
                            line-height: 30px;
                            overflow: hidden;
                            text-align: justify;
                            margin-top: 19px;
                            padding-right: 35px;
                            padding-bottom: 32px;
                            font-size: 20px;
                            color: #363636;
                            &:hover{
                                color: @blue;
                            }
                        }
                    }
                }
                .list:nth-of-type(2){
                    .img{
                        float: right;
                    }
                    .wrap{
                        float: left;
                    }
                }
            }

            .notice{
                .tit{
                    padding-top: 114px;
                }
                .more{ 
                    margin: 40px 0 18px;
                    .link{
                        float: right;
                        font-size: 20px;
                        color: #2e79f7;
                    }
                }
                .cont{  
                    border-radius: 9px;
                    background: #fff;
                    padding: 32px 30px 0;
                    .link{
                        display: block;
                        padding-bottom: 24px;
                        font-size: 20px;
                        color: #333;
                        &:hover{
                            color: @orange;
                        }
                    }
                }
            }
        }
        
        .types{
            background: #fcfcfc;
        }

        .partner{
            .tit{
                padding: 118px 0 66px;
            }
            .ul{
                padding-bottom: 55px;
                .list{
                    float: left;
                    width: 33%;
                    height: 94px;
                    line-height: 94px;
                    text-align: center;
                }
            }
        }

        .mask{
            position: fixed;
            background: rgba(0, 0, 0, 0.7);
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            .wrap{
                width: 356px;
                height: 424px;
                position: absolute;
                top: 45%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .img{
                width: 100%;
            }
            .close{
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(50%,-50%);
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #f69992;
                background: #fff;
                border-radius: 50%;
            }
        }
    }
</style>

<template lang="pug">
    .index
        Vhead
        .img_wrap
            .img
        
        .datas.bg_fff 
            .main 
                h3.tit 运营数据
                .clearfix
                    dl 
                        dt 
                            span(v-for="item in fixMoney3") {{item}}
                            em 亿
                            span(v-for="item in fixMoney4") {{item}}
                            em 万
                        dd 累计成交额(元)
                    dl 
                        dt 
                            span(v-for="item in fixUser3") {{item}}
                            em 万
                            span(v-for="item in fixUser4") {{item}}
                            em 人
                        dd 累计服务用户数(人)
          
        .bg 
            .main
                .product
                    h3.tit 产品介绍
                    ul.list_wrap.clearfix
                        li.list
                            h4.name 新手专享
                            p.msg 限新用户首次投资
                            img.rate2(src="./img/en_13.0.png") 
                            p.info
                                span.text 参考年化利率
                                i.icon(@mouseover="showTip2 = true", @mouseout="showTip2 = false") ?
                                span.tip(v-show="showTip2") 按参考年化利率计算的利息不代表对实际获得利息的承诺
                            p.time 首投专享 100元起投
                            p.btn.hand(@click="showMask = true") 立即投资
                        li.list
                            h4.name 尊享金蛋
                            p.msg 合规运营，不可转让
                            img.rate3(src="./img/en_8.3.png") 
                            p.info
                                span.text 参考年化利率
                                i.icon(@mouseover="showTip3 = true", @mouseout="showTip3 = false") ?
                                span.tip(v-show="showTip3") 按参考年化利率计算的利息不代表对实际获得利息的承诺
                            p.time 投资期限  91～180天
                            p.btn.hand(@click="showMask = true") 立即投资

                        li.list
                            h4.name 尊享金蛋
                            p.msg 合规运营，不可转让
                            img.rate3(src="./img/en_9.6.png") 
                            p.info
                                span.text 参考年化利率
                                i.icon(@mouseover="showTip3 = true", @mouseout="showTip3 = false") ?
                                span.tip(v-show="showTip3") 按参考年化利率计算的利息不代表对实际获得利息的承诺
                            p.time 投资期限  271～364天
                            p.btn.hand(@click="showMask = true") 立即投资
                        
                .news
                    h3.tit 新闻动态
                    p.more.clearfix
                        Vlink.link(href="news.html", target='_blank') 更多新闻 >>>
                    .list.clearfix(v-for="(item, index) in lists", :key="index")
                        img.img.fl(:src="item.title_img")
                        .fr.wrap
                            Vlink.cont.fr(:href="item.medium_url", target="_blank")
                                h4.name {{item.title}}
                                p.from 
                                    span {{item.report_time | splitTime}}
                                    span.ml10 来源:{{item.medium}}
                                p.text {{item.medium_desc}}

                .notice
                    h3.tit 平台公告
                    p.more.clearfix
                        Vlink.link(href="board.html", target='_blank') 更多公告 >>>
                    .cont 
                        Vlink.link(:href="item.link", target="_blank", v-for="(item, index) in notices", :key="index")
                            span {{item.tag}}
                            span(style="margin-left: 18px") {{item.title}}
                            span.fr {{item.time}}

        .types
            .main 
                img(src="./img/en_bottom2.png")

        .partner.main 
            h3.tit 合作伙伴 
            .ul.clearfix
                Vlink.list(href='https://xwbank.com/index.html', target='_blank')
                    img(src="./img/en_fr1.jpg") 
                Vlink.list(href='http://www.aliyun.com', target='_blank')
                    img(src="./img/en_fr2.jpg") 
                Vlink.list(href='http://www.jingtian.com', target='_blank')
                    img(src="./img/en_fr3.jpg") 

        .mask(v-show="showMask")
            .wrap
                .pr
                    img.img(src="./img/en_hongbao.png")
                    i.close.hand(@click="showMask = false") X

        Vfoot
        Vfixed
</template>

<script>
import {TweenLite} from "gsap/TweenLite";
export default {
    name: 'index',
    data() {
        return {
            showTip1: false,
            showTip2: false,
            showTip3: false,
            showMask: false,
            lists: [],
            money: 0,
            user: 0,
            tweenMoney: 0,
            tweenUser: 0,
            notices: [
                {
                    link: 'http://www.neeq.com.cn/disclosure/2018/2018-05-16/1526458807_484564.pdf',
                    tag: '[临时公告]',
                    title: '软智科技:北京市竞天公诚律师事务所关于南京金蛋科技股份有限公司2017年年度股东大会的法律意见书',
                    time: '2018-05-16'
                },
                {
                    link: 'http://www.neeq.com.cn/disclosure/2018/2018-05-16/1526458689_749417.pdf',
                    tag: '[临时公告]',
                    title: '软智科技:2017年年度股东大会决议公告',
                    time: '2018-05-16'
                },
                {
                    link: 'http://www.neeq.com.cn/disclosure/2018/2018-04-27/1524769149_977065.pdf',
                    tag: '[临时公告]',
                    title: '软智科技:2017年度股东大会通知公告',
                    time: '2018-04-27'
                },
                {
                    link: 'http://www.neeq.com.cn/disclosure/2018/2018-04-27/1524768973_756687.pdf',
                    tag: '[临时公告]',
                    title: '软智科技:第二届监事会第二次会议决议公告',
                    time: '2018-04-27'
                },
                {
                    link: 'http://www.neeq.com.cn/disclosure/2018/2018-04-27/1524768934_285006.pdf',
                    tag: '[临时公告]',
                    title: '软智科技:第二届董事会第二次会议决议公告',
                    time: '2018-04-27'
                },
            ],
        }
    },
    filters: {
        splitTime(s) {
            if (!s) return ''
            return s.split(' ')[0]
        }
    },
    computed: {
        fixMoney3() {
            let str = String(this.tweenMoney.toFixed(0).slice(0, 3))
            switch (str.length) {
                case 1:
                    return '00' + str;
                case 2:
                    return '0' + str;
                default:
                    return str; 
            }
        },
        fixMoney4() {
            let str = String(this.tweenMoney.toFixed(0).slice(3))
            switch (str.length) {
                case 1:
                    return '000' + str;
                case 2:
                    return '00' + str;
                case 3:
                    return '0' + str;
                default:
                    return str; 
            }
        },
        fixUser3() {
            let str = String(this.tweenUser.toFixed(0).slice(0, 3))
            switch (str.length) {
                case 1:
                    return '00' + str;
                case 2:
                    return '0' + str;
                default:
                    return str; 
            }
        },
        fixUser4() {
            let str = String(this.tweenUser.toFixed(0).slice(3))
            switch (str.length) {
                case 1:
                    return '000' + str;
                case 2:
                    return '00' + str;
                case 3:
                    return '0' + str;
                default:
                    return str; 
            }
        }
    },
    watch: {
        money(newValue) {
            TweenLite.to(this.$data, 2, {tweenMoney: newValue})
        },
        user(newValue) {
            TweenLite.to(this.$data, 2, {tweenUser: newValue})
        },
    },
    created() {
        Promise.all([this.getNewsList(), this.getMoney()])
        .then(res => {
            this.lists = res[0].list
       
            this.money = Math.round(res[1].total_money / 10e5)
            this.user = Math.round(res[1].user_count.data)
        })
        .catch(err => {
            console.log(err)
        })
    },
    mounted() {
        document.title = '金蛋理财官网 新三板上市互联网金融平台|P2P网贷平台|互联网金融平台，提供专业贷款'
        document.getElementById('keywords').content = '理财,互联网理财平台,安全理财产品,网上贷款平台,个人投资理财计划,互联网金融平台,P2P,新三板上市,个人理财,互联网金融,随心金蛋,首批接入'
        document.getElementById('description').content = '金蛋理财致力于为个人提供多元化投资理财产品与更优质的综合网上贷款平台服务，理财最低100元起投，年化收益率高达8%，资金银行全程存管，满足您个人投资理财计划需求'
    },
    methods: {
        getNewsList() { // 获取新闻列表
            return this.$jsonp({
                url: '//m.jindanlicai.com/Share_news/get_news_list',
                data: {
                    limit: 2
                },
            })
        },
        getMoney() { // 获取钱数和人数的数据
            return this.$jsonp({
                url: '//xwm.jindanlicai.com/new_data_chart/www_chart',
            })
        }
    }
};
</script>