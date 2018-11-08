<style lang="less">
    .v-link{
        display: inline-block;
        color: currentColor;
    }
</style>

<template lang="pug">
    a(class="v-link", :href="link", :target="tag", @click="vClick", :name="track")
        slot
        
</template>

<script>
export default {
    name: 'Vlink',
    props: {
        href: {
            type: String,
            default: '',
        },
        app: {
            type: String,
            default: '',
        },
        wap: {
            type: String,
            default: '',
        },
        target: {
            type: String,
            default: ''
        },
        track: {
            type: String,
            default: '',
        }
    },
    computed: {
        link() {
            if (config.system.isApp && this.app) {
                return this.app || 'javascript:;'
            } else {
                return this.href || this.wap || 'javascript:;'
            }
        },
        tag() {
            if (this.target) {
                return this.target
            } else if (config.system.isApp) { // app
                return '_blank'
            } else {
                return '_self'
            }
        }
    },
    methods: {
        vClick(ev) {
            this.$emit('click', ev)
        }
    }
};
</script>

