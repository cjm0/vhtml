<style lang="less">
     @import '../../assets/mixin';
    .err-index{
        .text{
            margin-top: 120px;
            font-size: 20px;
        }
    }
</style>

<template lang="pug">
    .err-index 
        Vhead
        .main 
            p.text.tc 页面找不到了~

</template>

<script>
export default {
    name: 'err',
    data() {
        return {
           title: '错误'
        }
    },
    mounted() {
        document.setTitle(this.title)
    }
};
</script>