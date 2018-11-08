<template lang="pug">
.v-head
    .main
        Vlink(href="index.html")
            img.img(src="./base_logo.png")
        ul.tab.f18.clearfix
            li.tab_list.clearfix(v-for="(item, index) in tabs", @click="tab(index)", :class="index == cur ? 'tab_active' : ''")
                Vlink.fl.pl20.pr20(:href="item.link") {{item.name}}
                span(v-if="index != tabs.length - 1").fl.tab_line
                i(v-if="index == cur").tab_dot 
</template>

<script>
export default {
    name: 'Vhead',
    data() {
        return {
            cur: localStorage.getItem('cur') || -1,
            tabs: [
                {
                    name: '首页',
                    link: 'index.html',
                },
                {
                    name: '平台保障',
                    link: 'security.html',
                },
                {
                    name: '合规体系',
                    link: 'compliance.html',
                },
                {
                    name: '信息披露',
                    link: 'information.html',
                },
                {
                    name: '联系我们',
                    link: 'contactus.html',
                },
            ]
        }
    },
    methods: {
        tab(index) {
            this.cur = index
            localStorage.setItem('cur', index)
        }
    },
};
</script>