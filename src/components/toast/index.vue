<template lang="pug">
.v-toast(v-show="text")
    .v-toast-mask(v-show="option.mask" @click="option.maskClose && hide()")
    .v-toast-box(@click="hide") {{text}}
</template>

<script>
/*
    Toast.show('msg')
    Toast.show('msg', {
        mask: true,
        time: 40000
    })
*/

let timer = null
let option = {
    mask: false,
    maskClose: true,
    time: 3000
}
export default {
    name: 'Toast',
    data() {
        return {
            text: '',
            option: Object.assign({}, option)
        }
    },
    methods: {
        hide() {
            this.text = ''
            clearTimeout(timer)
            timer = null;
        },
        show(text, op) {
            this.hide()
            if (op) {
                this.option = Object.assign(option, op)
            } else {
                this.option = Object.assign({}, option)
            }
            timer = setTimeout(() => {
                this.text = ''
            }, this.option.time)
            this.text = text
        }
    },
    mounted() {
        window['Toast'] = {
            show: this.show,
            hide: this.hide
        }
    }
}
</script>