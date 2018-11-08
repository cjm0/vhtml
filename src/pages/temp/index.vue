<style lang="less">
     @import '../../assets/mixin';
    .temp-index{
        
    }
</style>

<template lang="pug">
    .temp-index 
        Vhead
        .main temp
            
        Vfoot
        Vfixed
</template>

<script>
export default {
    name: 'temp',
    data() {
        return {
           title: 'temp'
        }
    },
    mounted() {
        document.setTitle(this.title)
    }
};
</script>