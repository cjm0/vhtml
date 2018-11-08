<template lang="pug">
.v-foot
    .main 
        .clearfix
            .links_wrap.fl
                .links.clearfix
                    Vlink.link(:href="item.link", :target="item.target", v-for="(item, index) in links", :key="index") {{item.name}}
                Vlink.tip(href="dangrous.html")
                    img.icon_dangrous(src="./dangrous.png")
                    span 风险提示
                    img.icon_arrowright(src="./right.png")
                .text
                    p 出借有风险，选择需谨慎
                    p 页面 / 广告中的名称仅为不同出借模式的标示，非理财产品
                    p 平台建议年均出借回报率仅供参考，不代表未来收益
                    p 本网站显示数据非特别标注，为我司统计值
                .icons_list
                    Vlink.icons_wrap(href="xkz.html")
                        img.icons(src="./en-icon1.jpg")
                    Vlink.icons_wrap(href="xkz2.html")
                        img.icons(src="./en-icon2.jpg")
                    Vlink.icons_wrap(href="xkz3.html")
                        img.icons(src="./en-icon3.png")
  
            .wx_wrap.fl
                p.text 关注我们
                img.img(src="./en-us.png")

            .phone_wrap.fr.tr
                p.f16 金蛋理财服务热线
                p.phone 400-665-0371 
                ul.ul.f12
                    li 周一至周日 10:00-19:00
                    li 法定节假日 10:00-18:00
                    li 出借有风险，选择需谨慎

        .copyright_wrap
            span.mr10 Copyright © 北京钱得乐科技有限公司
            Vlink.mr10(href="xkz.html") 京ICP证151014号

            Vlink(href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502031554" target="_blank")
                img.img(src="./base_jgwab.png")
                span 京公网安备 11010502031554号
            
            em |
            Vlink(href="zizhi.html") 营业执照
            em |
            Vlink(href="privacy.html") 隐私协议 
            em |
            span 联系电话:010-82888099
</template>

<script>
export default {
    name: 'Toast',
    data() {
        return {
            links: [
                {
                    name: '公司简介',
                    link: 'information.html#0',
                    target: '_self'
                },
                {
                    name: '平台保障',
                    link: 'security.html',
                    target: '_self'
                },
                {
                    name: '合规体系',
                    link: 'compliance.html',
                    target: '_self'
                },
                {
                    name: '信息披露',
                    link: 'information.html#0',
                    target: '_self'
                },
                {
                    name: '运营月报',
                    link: 'https://a.jindanlicai.com/xwa/report_pc',
                    target: '_blank'
                },
                {
                    name: '联系我们',
                    link: 'contactus.html',
                    target: '_self'
                },
                {
                    name: '手机客户端',
                    link: 'download.html',
                    target: '_self'
                },
            ]
        }
    }
};
</script>