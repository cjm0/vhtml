<template lang="pug">
.v-fixed
    p.icon.icon1 
    p.icon.icon2(@mouseover="show2 = true", @mouseout="show2 = false")
        img.icon2_1(src="./ens5.png", v-show="show2")
    p.icon.icon3(@mouseover="show3 = true", @mouseout="show3 = false")
        img.icon3_1(src="./ens4.png", v-show="show3")
    p.icon.icon4(@click="toTop")
</template>

<script>
export default {
    name: 'Vfixed',
    data() {
        return {
            show2: false,
            show3: false,
        }
    },
    methods: {
        toTop() {
            let sys = true
            let timer = null
            let speed

            window.onscroll = function(){
                if (!sys) { // 回顶部时可以再滚
                    clearInterval(timer);
                }
                sys = false;
            }

            clearInterval(timer);
            timer = setInterval(function() {
                var top = document.body.scrollTop || document.documentElement.scrollTop;
                speed = Math.floor(-top/2);
                if (top == 0) {
                    clearInterval(timer);
                }
                document.body.scrollTop = top + speed;
                document.documentElement.scrollTop = top + speed;
                sys = true;
            }, 30)
        }
    }
};
</script>