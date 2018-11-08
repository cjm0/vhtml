<style lang="less">
    .v-link{
        display: inline-block;
        color: currentColor;
    }
</style>

<template lang="pug">
    router-link(class="v-link", :to="link", :target="tag", @click.native="vClick", :name="track", teyp="router", v-if="isRouter")
        slot
    a(class="v-link", :href="link", :target="tag", @click="vClick", :name="track", v-else)
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
            return this.href || 'javascript:;'
        },
        tag() {
            if (this.target) {
                return this.target
            } else {
                return '_self'
            }
        }
    },
    data() {
        return {
            isRouter: false
        }
    },
    created() {
        if (this.link) {
            this.$root.$data.routerName.forEach(v => {
                if (v.indexOf(this.link) > -1) {
                    this.isRouter = true
                }
            })
        }
    },
    methods: {
        vClick(ev) {
            this.$emit('click', ev)
        }
    }
};
</script>

