<template lang="pug">
    .v-loading(:class="classes", :style="style")
        span.v-loading-spinner(:class="'v-loading-spinner-' + type")
            i(v-for="(item, loadIndex) in (type === 'spinner' ? 12 : 0)", :key="loadIndex")
            svg.v-loading-circular(v-if="type === 'circular'", viewBox="25 25 50 50")
                circle(cx="50", cy="50", r="20", fill="none")
</template>
<script>
const prefixCls = 'v-loading-';
export default {
    name: 'Loading',
    props: {
        size: {
            type: [String, Number],
            default: '30'
        },
        type: {
            type: String,
            default: 'circular'
        },
        color: {
            type: String,
            default: 'black'
        }
    },
    computed: {
        style() {
            return this.size ? {
                width: this.size + 'px',
                height: this.size + 'px',
                backgroundSize: `auto ${this.size * 13 / 30}px`
            } : {

            }
        },
        classes() {
            return {
                [`${prefixCls + this.type}`]: this.type,
                [`${prefixCls + this.color}`]: this.color,
                [`${prefixCls}egg`]: this.type === 'circular',
            }
        }
    }
}
</script>