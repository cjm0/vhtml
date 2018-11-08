<style lang="less">
.contactus {
  width: 100%;
  min-width: 1200px;
  .ct_head {
    background: url(./img/ct01.jpg) no-repeat center 0;
    width: 100%;
    height: 379px;
    background-size: cover;
    color: #fff;
    text-align: center;
    font-weight: 300;
    h2 {
      font-size: 80px;
      padding-top: 70px;
      font-weight: 300;
    }
    p {
      padding-top: 2px;
      font-size: 30px;
    }
  }
  .ct-total1 {
    background-color: #f4f5f6;
    text-align: center;
    margin-bottom: -177px;
  }
  .ct-total1 .ct-body1 {
    position: relative;
    top: -120px;
    overflow: hidden;
  }
  .ct-total2 {
    padding-top: 93px;
    background-color: #fff;
    padding-bottom: 168px;
  }
  .ct-body {
    margin: 0 auto;
    width: 1200px;
    .head {
      height: 870px;
      img {
        vertical-align: middle;
      }
      img:nth-of-type(1) {
        width: 848px;
        height: 350px;
      }
      img:nth-of-type(2) {
        width: 350px;
        height: 350px;
      }
      img:nth-of-type(3),
      img:nth-of-type(4) {
        width: 600px;
        height: 360px;
      }
      p {
        font-size: 24px;
        color: #666;
        text-align: left;
        padding: 41px 0 35px;
      }
    }
    dl img {
      width: 1200px;
      height: 490px;
    }
    dl dd p {
      padding: 40px 0;
      font-size: 24px;
      color: #666;
    }
    .ct-code img {
      width: 1200px;
      height: 297px;
    }
  }
}
</style>

<template lang="pug">
    .contactus_index
      Vhead
      .contactus
          .ct_head
              h2 联系我们
              p CONTACT US
          .ct-total1
              .ct-body.ct-body1
                  .head 
                      img(src="./img/ct02.png")
                      img(src="./img/ct03.png")
                      img(src="./img/ct04.png")
                      img(src="./img/ct05.png")
                      p 公司办公环境
          .ct-total2
              .ct-body
                  dl
                      dt
                          a(href="http://map.baidu.com/?latlng=40.005348,116.39436&amp;title=%E5%8C%97%E4%BA%AC%E9%92%B1%E5%BE%97%E4%B9%90%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&amp;content=%E5%9C%B0%E5%9D%80%EF%BC%9A%E5%8C%97%E4%BA%AC%E5%B8%82%E6%9C%9D%E9%98%B3%E5%8C%BA%E5%8C%97%E8%BE%B0%E4%B8%96%E7%BA%AA%E4%B8%AD%E5%BF%83B%E5%BA%A76%E5%B1%82" target="_blank")
                              img(src="./img/ct_08.png")
                      dd
                          p 公司地址：北京市朝阳区北辰世纪中心B座6层（鸟巢北侧800米）
                  .ct-qcode
                      img(src="./img/ct_07.png")

      Vfoot
      Vfixed

</template>

<script>
export default {
  name: "contactus",
  data() {
    return {
      title: '联系我们'
    };
  },
  mounted() {
      document.setTitle(this.title)
  }
};
</script>