<style lang="less">
     @import '../../assets/mixin';
    .compliance-index{
        .img_wrap{
            height: 380px;
            text-align: center;
            color: #fff;
            .img{
                background: #474e63 url('./hg01.png') center 0 no-repeat;
                height: 100%;
                background-size: cover;
            } 
            .h2{
                font-size: 80px;
                padding-top: 130px;
                font-weight: 300;
            }
            .en{
                font-size: 30px;
                margin-top: 15px;
            }
        }

        .bg{
            background: @bg;

            .tit{
                height: 104px;
                line-height: 104px;
                font-size: 40px;
                color: #000f56;
                font-weight: 600;
                span {
                    display: inline-block;
                    line-height: 104px;
                    &:nth-of-type(2) {
                        border-bottom: 4px solid #1373fb;
                    }
                }
            }
            .info{
                margin-top: 30px;
                line-height: 2;
                font-size: 22px;
                color: #6881a6;
            }

            .bank{
                text-align: center;
                padding-top: 120px;
                .img{
                    margin-top: 72px;
                    width: 770px;
                    height: 700px;
                }
            }

            .information{
                text-align: center;
                padding-top: 35px;
                .img{
                    margin-top: 51px;
                    width: 1190px;
                    height: 578px;
                }
            }

            .honor{
                text-align: center;
                padding: 152px 0 120px;
                .wrap{
                    padding-top: 30px;
                }
                .list{
                    float: left;
                    width: 50%;
                    margin-top: 80px;
                    .img{
                        width: 406px;
                        height: 550px;
                    }
                    .text{
                        margin-top: 60px;
                        line-height: 2;
                        font-size: 22px;
                        color: #6881a6;
                    }
                }
            }
        }
    }
</style>

<template lang="pug">
    .compliance-index 
        Vhead
        .img_wrap
            .img
                h2.h2 {{title}}
                p.en COMPLIANCE SYSTEMS
        .bg 
            .main 
                .bank
                    .tit 
                        span 已于2016年8
                        span 月接入
                        span 银行资金存管
                    .info
                        p 金蛋理财积极响应监管要求保障投资人资金安全，
                        p 于2016年8月率先接入银行存管，成为业内极少数接入银行存管的平台之一。
                    img.img(src="./hg02.png")

                .information
                    .tit 
                        span 等保三级备案 -&nbsp;
                        span 信息系
                        span 统安全等级保护
                    .info
                        p 金蛋理财获得中华人民共和国公安部颁发的信息系统安全等级保护第三级备案证明
                    img.img(src="./hg03.png")

                .honor
                    .tit 
                        span 金蛋理
                        span 财的获
                        span 奖荣誉
                    .wrap.clearfix
                        .list 
                            img.img(src="./hg04.png")
                            p.text 2017中国新金融行业总评榜—在线理财稳健发展企业
                        .list 
                            img.img(src="./hg05.png")
                            p.text 2015互联网金融金橙奖—互联网金融影响力平台
                        .list 
                            img.img(src="./hg06.png")
                            p.text 中关村高新技术企业
                        .list 
                            img.img(src="./hg07.png")
                            p.text 2015中国互联网金融最具竞争力企业

        Vfoot
        Vfixed
</template>

<script>
export default {
    name: 'compliance',
    data() {
        return {
           title: '合规体系'
        }
    },
    mounted() {
        document.setTitle(this.title)
    }
};
</script>