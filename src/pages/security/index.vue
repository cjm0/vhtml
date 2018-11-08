<style lang="less">
     @import '../../assets/mixin';
    .security-index{
        .img_wrap{
            height: 380px;
            text-align: center;
            color: #fff;
            .img{
                background: #474e63 url('./sc01.png') center 0 no-repeat;
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
                
                font-weight: 600;
                span {
                    display: inline-block;
                    line-height: 104px;
                    &:nth-of-type(2) {
                        border-bottom: 4px solid @red;
                    }
                }
            }
            .info{
                margin-top: 30px;
                line-height: 2;
                font-size: 22px;
                color: @gray;
            }

            .bank{
                text-align: center;
                padding-top: 120px;
                .img{
                    margin-top: 90px;
                }
            }

            .sd{
                text-align: center;
                padding-top: 94px;
            }

            .ul{
                margin-top: 120px;
                .list{
                    box-sizing: border-box;
                    margin-bottom: 176px; 
                    width: 1138px;
                    position: relative;
                    background-color: #fff;
                    &:nth-child(2n + 1) {
                        margin-left: 64px;
                        .img{
                            float: left;
                            margin-left: -84px;
                        }
                        .cont{
                            float: right;
                            padding: 100px 55px 45px 0;
                        }
                    }

                    .img{
                        float: right;
                        margin-right: -84px;
                        margin-top: -56px;
                        width: 334px;
                        height: 334px;
                    }

                    .cont{
                        float: left;
                        width: 800px;
                        padding: 100px 0 45px 55px;
                        .name{
                            padding-left: 22px;
                            border-left: 4px solid @red;
                            color: #1c1c1c;
                            font-size: 48px;
                        }
                        .text{
                            margin-top: 35px;
                            line-height: 2;
                            color: @gray;
                            font-size: 22px;
                        }
                    }
                }
            }

            .private{
                padding-bottom: 100px;
                .img{
                    margin-top: 50px;
                    width: 1237px;
                    height: 380px;
                }
            }
        }
    }
</style>

<template lang="pug">
    .security-index 
        Vhead
        .img_wrap
            .img
                h2.h2 {{title}}
                p.en PLATFORM ASSURANCE
        .bg 
            .main 
                .bank
                    .tit 
                        span 银行存管
                        span 为资金
                        span 保驾护航
                    .info
                        p 金蛋理财在存管银行为每个用户设立独立账户，
                        p 每个用户资金存入个人独立账户，银行根据投资人、借款人的指令和合同约定，对资金使用、划付进行管理和监督。
                    img.img(src="./sc02.png")
                
                .sd
                    .tit 
                        span 大数据风控体系
                        span “神盾”
                        span 为资金保驾护航
                    .info
                        p “神盾”风控系统通过独有的风控模型和信用评价体系，多维度立体审核预判，运用大数据分析系统、
                        p 量化金融模型以及智能化算法，以更高效的科技手段全流程监控资产安全，为蛋友们提供金融服务，有效抵御风险。

                .ul 
                    .list.clearfix
                        img.img(src="./sc03.png") 
                        .cont 
                            p.name 大数据风控模型
                            p.text 通过数据积累，大规模数据分析及深度学习，建立包含2000+维度金融属性特征变量的风控模型，全面评估借款人信用风险，对借款人打分评级。

                    .list.clearfix
                        img.img(src="./sc04.png") 
                        .cont
                            p.name 强大的反欺诈能力
                            p.text 通过多重信息交叉校验，全方位大数据处理信息，对借款人的真实性进行校验并有效防范欺诈风险。

                    .list.clearfix
                        img.img(src="./sc05.png") 
                        .cont
                            p.name 全流程实时监控
                            p.text 结合时间、物理设备、人群特征等因素，通过报警、报表、电话回访、人工核查、风险回顾等手段，进行全流程监控，建立问题快速发现及高效解决机制。

                .private.tc
                    .tit 
                        span 资深技术团
                        span 队保
                        span 障用户隐私

                    img.img(src="./sc07.png")


        Vfoot
        Vfixed
</template>

<script>
export default {
    name: 'security',
    data() {
        return {
           title: '平台保障'
        }
    },
    mounted() {
        document.setTitle(this.title)
    }
};
</script>