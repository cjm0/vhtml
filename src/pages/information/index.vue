<style lang="less">
// @import 'assets/mixin';
.information {
  h2,
  h3,
  h4 {
    font-weight: 300;
  }

  .p-content {
    background: #e9e9e9;
    padding-bottom: 60px;
  }

  .m-head {
    background: #474e63;
    height: 379px;
    text-align: center;
    color: #fff;
    h2 {
      font-size: 80px;
      font-weight: 300;
      padding-top: 70px;
      height: 105px;
    }
    p {
      font-size: 30px;
    }
    .p-w {
      background: url(./img/aboout_bg.png) center 0 no-repeat;
      height: 100%;
    }
  }

  .p-body {
    position: relative;
    margin: 0 auto;
    margin-top: -120px;
    background: #f3f5f6;
    overflow: hidden;
    width: 1200px;
    
  }

  .in-left {
    float: left;
    width: 259px;
    position: relative;
    padding-top: 50px;
    padding-bottom: 313px;

    .in-menu {
      padding-left: 30px;
      dl {
        background-color: #fff;
        width: 180px;
        height: 70px;
        box-sizing: border-box;
        padding: 22px 24px 26px;
        border-top: 1px solid #ccc;
        overflow: hidden;
        //margin-top:-1px;
        dt {
          float: left;
          font-size: 16px;
          color: #262a2e;
          letter-spacing: 0;
        }
        dd {
          float: right;
          width: 0;
          height: 0;
          margin-top: 5px;
          border-top: 5px solid transparent;
          border-left: 10px solid #d7dadd;
          border-bottom: 5px solid transparent;
        }
        ul {
          position: absolute;
          display: none;
          background-color: #fff;
          z-index: 20;
          left: 209px;
          li {
            width: 160px;
            height: 70px;
            line-height: 70px;
            text-align: center;
            a {
              display: inline-block;
              width: 100%;
              height: 70px;
            }
            span {
              font-size: 16px;
              color: #262a2e;
              letter-spacing: 0;
            }
          }
          li:hover {
            background-color: #474e63;
            span {
              color: #ffffff;
            }
          }
        }
      }

      dl:hover {
        background-color: #474e63;
        dt {
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
        }
        dd {
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-left: 10px solid #ffffff;
          border-bottom: 5px solid transparent;
        }
        ul {
          display: block;
        }
      }
      dl:nth-of-type(1) {
        border-top: none;
      }
    }

    dl:nth-of-type(1) ul {
      top: 50px;
    }

    dl:nth-of-type(2) ul {
      top: 120px;
    }

    dl:nth-of-type(3) ul {
      top: 190px;
    }

    dl:nth-of-type(4) ul {
      top: 260px;
    }
  }

  .in-right {
    float: left;
    width: 940px;
    padding-top: 50px;
    .title {
      .first {
        font-size: 12px;
        color: #6a6d75;
        letter-spacing: 0;
      }
      .second {
        //float: right;
        display: inline-block;
        width: 0;
        height: 0;
        margin-top: 3px;
        border-top: 5px solid transparent;
        border-left: 10px solid #d7dadd;
        border-bottom: 5px solid transparent;
        margin-left: 16px;
      }
      .third {
        font-size: 12px;
        color: #262a2e;
        letter-spacing: 0;
        padding-left: 16px;
      }
    }
    h3 {
      margin-top: 36px;
      font-size: 24px;
      color: #262a2e;
      letter-spacing: 0;
    }
    .content {
      width: 940px;
      box-sizing: border-box;
      // display: none;
      padding-bottom: 60px;
    }
    .content.showit {
      display: block;
    }
  }
  //-公司简介
  .company_profile {
    //padding-bottom: 60px;
    //display:block;
    h3 {
      margin-top: 36px;
    }
    p {
      margin-top: 24px;
      margin-bottom: 6px;
      text-align: justify;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    p.tips_bottom {
      text-align: center;
      color: rgb(155, 155, 152);
    }

    .environment {
      width: 940px;
      margin-top: 27px;
      background-color: #000;
      img {
        vertical-align: middle;
        // .tran();
        &.op {
          opacity: 0.6;
          transition: opacity .5s;
          filter: alpha(opacity=60);
        }
      }

      img:nth-of-type(1) {
        width: 640px;
        height: 480px;
      }
      img:nth-of-type(2) {
        width: 300px;
        height: 480px;
      }
      img:nth-of-type(3) {
        width: 470px;
        height: 360px;
      }
      img:nth-of-type(4) {
        width: 470px;
        height: 360px;
      }
    }
  }
  //-基本信息
  .basic_information {
    //display:block;
    //padding-bottom: 60px;
    margin-right: 49px;
    h3 {
      margin: 36px 0 24px;
      font-size: 24px;
      color: #262a2e;
      letter-spacing: 0;
    }
    table {
      //border: 1px solid #ccc;
      width: 100%;
      background-color: #fff;
      tr {
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        height: 60px;
        line-height: 60px;
        td:nth-of-type(1) {
          border-right: 1px solid #ccc;
          width: 198px;
          font-size: 14px;
          color: #6a6d75;
          letter-spacing: 0;
        }
        td:nth-of-type(2) {
          width: 692px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 24px;
        }
      }
      td {
        box-sizing: border-box;
        text-align: center;
      }

      tr:nth-of-type(1) {
        height: 120px;
        td:nth-of-type(1) {
          padding: 50px;
        }
        td:nth-of-type(2) {
          padding: 36px 0;
        }
      }
      tr:nth-of-type(6) {
        height: 180px;
        line-height: 180px;
        td:nth-of-type(2) {
          padding: 33px 50px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 23px;
        }
      }
      tr:nth-of-type(8),
      tr:last-child {
        border-bottom: 10px solid #f3f5f6;
        width: 100%;
      }
    }
    .jiagou {
      width: 100%;
      height: 480px;
      img {
        width: 100%;
        height: 480px;
      }
    }
  }
  //-团队介绍
  .team_introduction {
    //display:block;
    h3 {
      margin-top: 36px;
      font-weight: 400;
      font-size: 24px;
      color: #262a2e;
      letter-spacing: 0;
    }
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    dl {
      height: 324px;
      width: 890px;
      background-color: #fff;
      border-bottom: 10px solid #f3f5f6;
      overflow: hidden;
      dt {
        width: 250px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      dd {
        float: left;
        box-sizing: border-box;
        width: 640px;
        padding: 24px 29px 23px 23px;
        .head {
          strong {
            font-size: 24px;
            color: #000000;
            letter-spacing: 0;
            line-height: 33px;
          }
          span {
            font-size: 16px;
            color: #000000;
            letter-spacing: 0;
            line-height: 33px;
          }
          span:nth-of-type(1) {
            padding-left: 12px;
          }
          span:nth-of-type(2) {
            padding-left: 7px;
          }
        }
        p {
          text-align: justify;
          margin-top: 14px;
          font-size: 14px;
          color: #6a6d75;
          letter-spacing: 0;
          line-height: 23px;
        }
      }
    }
    dl:nth-of-type(1) {
      margin-top: 23px;
    }
    dl:nth-of-type(5) {
      dd {
        span:nth-of-type(1) {
          //font-size: 24px;
        }
        span:nth-of-type(2) {
          padding-left: 0;
        }
      }
    }
    .bottom {
      margin-top: 14px;
      width: 890px;
      img {
        width: 100%;
        height: 320px;
      }
    }
  }
  //资质证书
  .certifications {
    overflow: hidden;
    .imgshow {
      margin-top: 24px;
      //padding-right: 171px;
      div {
        width: 280px;
        float: left;
        margin-right: 25px;
        img {
          width: 280px;
          height: 380px;
        }
        p {
          padding-top: 18px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 23px;
        }
      }
      div:last-child {
        margin-top: 41px;
      }
    }
    .showmask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .close {
      position: absolute;
      width: 44px;
      text-align: center;
      height: 44px;
      line-height: 44px;
      border-radius: 50%;
      right: 15%;
      top: 3%;
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 20px;
    }
    .slider,
    .slider-panel img,
    .slider-extra {
      width: 489px;
      height: 700px;
    }
    .slider {
      position: absolute;
      text-align: center;
      margin: 30px auto;
      position: relative;
    }
    .slider-panel,
    .slider-nav,
    .slider-pre,
    .slider-next {
      position: absolute;
      z-index: 8;
    }
    .slider-panel {
      position: absolute;
    }
    .slider-panel img {
      border: none;
    }
    .slider-extra {
      position: relative;
    }
    .slider-nav {
      margin-left: -51px;
      position: absolute;
      left: 50%;
      bottom: -30px;
    }
    .slider-nav li {
      background: #3e3e3e;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      margin: 0 2px;
      overflow: hidden;
      text-align: center;
      display: inline-block;
      height: 6px;
      line-height: 18px;
      width: 6px;
    }
    .slider-nav .slider_item_selected {
      background: #ffffff;
    }
    .slider-page a {
      background: transparent;
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#33000000,endColorstr=#33000000);
      color: #fff;
      text-align: center;
      display: block;
      font-size: 22px;
      width: 28px;
      height: 62px;
      line-height: 62px;
      margin-top: -31px;
      position: absolute;
      top: 50%;
    }
    .slider-page a:hover {
      background: rgba(0, 0, 0, 0.4);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#66000000,endColorstr=#66000000);
    }
    .slider-pre {
      left: 0%;
      margin-left: -75px;
    }
    .slider-next {
      left: 100%;
      margin-left: 50px;
    }
  }
  //团队荣誉
  .team_honor {
    overflow: hidden;
    .imgshow {
      margin-top: 24px;
      div {
        width: 280px;
        height: 449px;
        float: left;
        margin-right: 25px;
        margin-top: 18px;
        img {
          width: 280px;
          height: 380px;
        }
        p {
          padding-top: 18px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 23px;
        }
      }
      div:nth-of-type(1),
      div:nth-of-type(2),
      div:nth-of-type(3) {
        margin-top: 0;
      }
    }
  }
  //银行存管
  .bank_depository {
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    .mainpart {
      margin-top: 23px;
      padding-bottom: 48px;
      background-color: #fff;
      width: 890px;
    }
    img:nth-of-type(1) {
      width: 266px;
      height: 380px;
      margin-top: 48px;
      margin-left: 146px;
    }
    img:nth-of-type(2) {
      width: 266px;
      height: 380px;
      margin-top: 48px;
      margin-left: 64px;
    }
    img:nth-of-type(3) {
      width: 645.3px;
      height: 587.4px;
      margin-top: 36px;
      margin-left: 122px;
    }
    .qe {
      margin-top: 64px;
      margin-left: 64px;
      font-size: 18px;
      color: #262a2e;
      letter-spacing: 0;
    }
    p.duli {
      margin-top: 16px;
      margin-left: 64px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    .ans {
      margin-top: 48px;
      overflow: hidden;
      .left,
      .right {
        float: left;
        width: 252px;
        margin-left: 118px;
        text-align: center;
        img {
          width: 165px;
          height: 165px;
          margin: 0;
        }
        p:nth-of-type(1) {
          text-align: center;
          margin-top: 24px;
          font-size: 16px;
          color: #262a2e;
          letter-spacing: 0;
        }
        p:nth-of-type(2) {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 24px;
        }
      }
      .right {
        margin-left: 119px;
        width: 266px;
      }
    }
  }
  //合作机构
  .cooperation_agencies {
    .mainpart {
      margin-top: 24px;
      overflow: hidden;
      width: 890px;
      background-color: #fff;
      padding-bottom: 40px;
    }
    dl {
      margin-top: 40px;
      overflow: hidden;
    }
    dt {
      float: left;
      width: 272px;
      padding-top: 92px;
      text-align: center;

      img {
        width: 136px;
        height: 39px;
        margin-left: 60px;
      }
    }
    dd {
      float: left;
      h3 {
        font-weight: 500;
        font-size: 20px;
        color: #262a2e;
        letter-spacing: 0;
      }
      p {
        text-align: justify;
        margin-top: 12px;
        width: 578px;
        font-size: 14px;
        color: #6a6d75;
        letter-spacing: 0;
        line-height: 23px;
      }
      p:nth-of-type(2) {
        margin-top: 10px;
      }
    }
    img:nth-of-type(2) {
      width: 160px;
      height: 42px;
    }
    img:nth-of-type(3) {
      width: 180px;
      height: 25px;
      margin-left: 50px;
    }
    img:nth-of-type(4) {
      width: 160px;
      height: 39px;
    }
    img:nth-of-type(5) {
      width: 180px;
      height: 56px;
      margin-left: 52px;
    }
    img:nth-of-type(6) {
      width: 152px;
      height: 74px;
      margin-left: 66px;
    }
    img:nth-of-type(7) {
      width: 167px;
      height: 43px;
      margin-left: 58px;
    }
    img:nth-of-type(8) {
      width: 150px;
      height: 47px;
      margin-left: 65px;
    }
  }
  //风控流程
  .wind_control_process {
    position: relative;
    a {
      position: absolute;
      top: 30px;
      right: 80px;
      img {
        width: 55px;
        height: 64px;
      }
    }
    .mainpart {
      margin-top: 24px;
      background-color: #fff;
      width: 890px;
      box-sizing: border-box;
      padding: 36px 65px 40px;
    }
    .title {
      margin-left: 211px;
      font-size: 20px;
      color: #262a2e;
      letter-spacing: 0;
    }
    .bline {
      margin-top: -11px;
      margin-left: 200px;
      width: 360px;
      height: 12px;
      opacity: 0.2;
      background: #0a2e59;
    }
    p.top {
      margin-top: 23px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    dl {
      margin-top: 28px;
      overflow: hidden;
      .desc {
        margin-top: 27px;
        font-size: 18px;
        color: #000000;
        letter-spacing: 0;
        line-height: 21px;
      }
      img {
        width: 140px;
        height: 140px;
        margin-left: 62px;
        //margin: 0 62px;
      }
      p {
        margin-top: 20px;
        font-size: 14px;
        color: #262a2e;
        letter-spacing: 0;
        line-height: 23px;
      }
      dt {
        float: left;
      }
      dd {
        float: left;
      }
    }
    dl:nth-of-type(2) {
      img {
        margin-left: 50px;
        margin-right: 62px;
      }
    }
  }
  //技术安全
  .technical_safely {
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
    .mainpart {
      width: 890px;
      box-sizing: border-box;
      margin-top: 25px;
      background-color: #fff;
      padding: 30px;
      img {
        width: 260px;
        height: 240px;
        margin-right: 25px;
        margin-top: 25px;
      }
      img:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  //运营数据
  .operating_data {
    .mainpart {
      margin-top: 24px;
      background-color: #fff;
      width: 890px;
      .title {
        padding: 20px 0 0 24px;
        font-weight: 500;
        font-size: 18px;
        color: #262a2e;
        letter-spacing: 0;
      }
      table {
        width: 100%;
        tr:nth-of-type(2) {
          td {
            padding-top: 0;
          }
        }
        td {
          padding-top: 40px;
          padding-bottom: 40px;
          text-align: center;
          width: 50%;
          span {
            font-size: 36px;
            color: #ff4149;
            letter-spacing: 7.2px;
          }
          p {
            margin-top: 21px;
            font-size: 14px;
            color: #6a6d75;
            letter-spacing: 0;
          }
        }
      }
      table.spe {
        border: 1px solid #e6e8eb;
        margin: 0 98px 51px;
        width: 698px;
        tr {
          border-bottom: 1px solid #e6e8eb;
          height: 60px;
        }
        td {
          width: 232px;
          padding: 0;
        }
        td:nth-of-type(2) {
          border-left: 1px solid #e6e8eb;
          border-right: 1px solid #e6e8eb;
        }
        thead {
          background: #ffffff;
          border: 1px solid #e6e8eb;
        }
        tbody {
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
        }
      }
      table.third {
        width: 100%;
        td {
          width: 33%;
        }
      }
      .line {
        width: 100%;
        height: 10px;
        background-color: #f3f5f6;
      }
      #net_tips {
        position: relative;
        .tips {
          position: absolute;
          right: -150px;
          top: -10px;
          i {
            width: 14px;
            height: 14px;
            display: inline-block;
            background-image: url(./img/shape1.png);
            background-size: 100%;
            transform: translate(0, -50%);
          }
          .words {
            box-sizing: border-box;
            display: inline-block;
            width: 236px;
            height: 80px;
            padding: 18px 0;
            background-image: url(./img/shape2.png);
            background-size: 100% 100%;
            opacity: 0.7;
            span {
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 0;
            }
            p {
              text-align: center;
              margin-top: 0;
              line-height: 21px;
            }
          }
          .show {
            visibility: visible;
          }
          .notshow {
            visibility: hidden;
          }
        }
      }
    }
    .bottom {
      p {
        padding-top: 24px;
        text-align: center;
        font-size: 12px;
        color: #a1a5ad;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }
  //运营月报
  .operating_monthly_report {
  }
  //收费标准
  .charges {
    table {
      margin-top: 24px;
      background-color: #fff;
      width: 890px;
      tr {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        color: #262a2e;
        letter-spacing: 0;
        line-height: 24px;
        border-bottom: 1px solid #ccc;
      }
      td:nth-of-type(1) {
        width: 445px;
      }
      td:nth-of-type(2) {
        width: 444px;
        border-left: 1px solid #ccc;
      }
      tr:nth-of-type(1) {
        font-size: 14px;
        color: #6a6d75;
        letter-spacing: 0;
      }
      tr:last-child {
        height: 120px;
        box-sizing: border-box;
        border-bottom: none;
        td:nth-of-type(1) {
          line-height: 120px;
        }
        td:nth-of-type(2) {
          padding: 24px;
          font-size: 14px;
          color: #262a2e;
          letter-spacing: 0;
          line-height: 24px;
        }
      }
    }
  }
  //重大事项
  .major_issues {
    table {
      margin-top: 24px;
      width: 890px;
      background-color: #fff;
      overflow: hidden;
      tr {
        box-sizing: border-box;
        height: 60px;
        overflow: hidden;
        border-bottom: 1px solid #e6e8eb;
      }
      tr:nth-of-type(6) {
        td:nth-of-type(1) {
          padding: 21px 0;
        }
        td:nth-of-type(2) {
          padding: 9px 0;
        }
      }
      tr:nth-child(7) {
        td:nth-of-type(1) {
          padding: 18px 0 24px;
        }
        td:nth-of-type(2) {
          padding: 30px;
        }
      }
      td {
        box-sizing: border-box;
        float: left;
        text-align: center;
        padding: 18px 0;
        font-size: 14px;
        color: #262a2e;
        letter-spacing: 0;
        line-height: 24px;
      }
      td:nth-of-type(1) {
        width: 589px;
        border-right: 1px solid #e6e8eb;
      }
      td:nth-of-type(2) {
        width: 300px;
      }
    }
  }
  //审计报告
  .audit_report {
    padding-bottom: 469px;
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
  }
  //合规报告
  .compliance_report {
    padding-bottom: 469px;
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
  }
  .audit_report,
  .compliance_report {
    h4 {
      font-size: 20px;
      margin: 30px 0 16px;
      clear: both;
      a {
        position: relative;
        display: inline-block;
        color: #737373;
        cursor: pointer;
        &.close::before,
        &.open::before {
          content: "";
          position: absolute;
          right: -28px;
          border-style: solid solid none none;
          width: 14px;
          height: 14px;
          border-width: 1px;
          border-color: #262a2e;
        }
        &.open::before {
          transform: rotate(135deg);
          top: 3px;
        }
        &.close::before {
          transform: rotate(-45deg);
          top: 11px;
        }
      }
      a:hover {
        color: #ff775f;
      }
    }
    &.content {
      .piclist {
        &.hide {
          display: none;
        }
        li {
          float: left;
          width: 30%;
          margin-right: 1%;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          img {
            width: 100%;
            vertical-align: middle;
          }
        }
      }
    }
  }
  //律师尽调
  .lawyers_effort {
    padding-bottom: 469px;
    .title {
      margin-top: 16px;
      font-size: 14px;
      color: #262a2e;
      letter-spacing: 0;
      line-height: 23px;
    }
  }
  // 法律法规
  .laws_regulations {
    ul {
      margin-top: 16px;
      li {
        margin-bottom: 7px;
        &:nth-of-type(2) .link {
          width: 222px;
        }
        &:nth-of-type(3) .link {
          width: 350px;
        }
        &:nth-of-type(4) .link {
          width: 318px;
        }
        &:last-of-type .link {
          width: 315px;
        }
      }
      a {
        font-size: 16px;
        color: #474e63;
        &:hover {
          color: #474e63 !important;
        }
      }
      .link {
        width: 350px;
        display: block;
        padding: 10px;
        text-align: left;
        color: #80848a;
        position: relative;
      }
      .link::after,
      .link::before {
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-left-color: #f3f5f6;
        position: absolute;
        top: 36%;
        right: 10px;
        content: "";
      }
      .link::before {
        top: 36%;
        right: 8px;
        border-left-color: #80848a;
      }
    }
  }
  // 遮罩
  .lightbox {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    .mask {
      height: 100vh;
      width: 100vw;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      background-color: black;
      filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
      opacity: 0.8;
    }
    .baogao {
      position: relative;
      left: 0;
      z-index: 1000;
      margin: 0 auto;
      width: 500px;
      .baogao_img {
        // height: 100%;
        width: 100%;
      }
      .close_img {
        float: right;
        margin-top: 10px;
      }
    }
  }

  .list-enter-active, .list-leave-active {
    transition: opacity .5s;
  }
  .list-enter, .list-leave-to  {
    opacity: 0;
  }
}
</style>

<template lang="pug">
    //- .information
    .information
        Vhead
        .m-head
            .p-w
                h2 信息披露
                p INFORMATION DISCLOSURE
        .p-w.p-body
            .in-left
                .in-menu
                    dl
                        dt 公司概况
                        dd
                        ul
                          li(@click="routerId = 0,first = '公司概况',third = '公司简介'")
                              a(href='information.html#0')
                                  span 公司简介
                          li(@click="routerId = 1,first = '公司概况',third = '基本信息'")
                              a(href='information.html#1')
                                  span 基本信息
                          li(@click="routerId = 2,first = '公司概况',third = '管理团队'")
                              a(href='information.html#2')
                                  span 管理团队
                          li(@click="routerId = 3,first = '公司概况',third = '资质证书'")
                              a(href='information.html#3')
                                  span 资质证书
                          li(@click="routerId = 4,first = '公司概况',third = '公司荣誉'")
                              a(href='information.html#4')
                                  span 公司荣誉
                          li(@click="routerId = 5,first = '公司概况',third = '银行存管'")
                              a(href='information.html#5')
                                  span 银行存管
                          li(@click="routerId = 6,first = '公司概况',third = '合作机构'")
                              a(href='information.html#6')
                                  span 合作机构
                    dl
                        dt 平台保障
                        dd
                        ul
                          li(@click="routerId = 7,first = '平台保障',third = '风控流程'")
                              a(href='information.html#7')
                                  span 风控流程
                          li(@click="routerId = 8,first = '平台保障',third = '技术'")
                              a(href='information.html#8')
                                  span 技术
                    dl
                        dt 运营信息
                        dd
                        ul
                          li(@click="routerId = 9,first = '运营信息',third = '运营数据'")
                              a(href='information.html#9')
                                  span 运营数据
                          li(@click="routerId = 10,first = '运营信息',third = '运营月报'")
                              a(href="https://a.jindanlicai.com/xwa/report_pc")
                                  span 运营月报
                          li(@click="routerId = 11,first = '运营信息',third = '收费标准'")
                              a(href='information.html#11')
                                  span 收费标准
                    dl
                        dt 平台公告
                        dd
                        ul
                          li(@click="routerId = 12,first = '平台公告',third = '重大事项'")
                              a(href='information.html#12')
                                  span 重大事项
                          li(@click="routerId = 13,first = '平台公告',third = '审计报告'")
                              a(href='information.html#13')
                                  span 审计报告
                          li(@click="routerId = 14,first = '平台公告',third = '合规报告'")
                              a(href='information.html#14')
                                  span 合规报告
                          li(@click="routerId = 15,first = '平台公告',third = '律师尽调'")
                              a(href='information.html#15')
                                  span 律师尽调
                          li(@click="routerId = 16,first = '平台公告',third = '法律法规'")
                              a(href='information.html#16')
                                  span 法律法规
            .in-right
                .title
                    span.first {{first}}
                    span.second
                    span.third {{third}}
                div.company_profile.content(v-if="routerId == 0")
                    h3 金蛋理财
                    p 金蛋理财成立于2015年，隶属于百乘金科旗下品牌，新三板挂牌公司软智科技（832144）旗下全资互联网金融平台，秉承着合规先行、用户至上的<br/>经营理念，为广大投资用户创建的安全、便捷、阳光的网络借贷信息中介平台。金蛋理财积极践行普惠金融核心价值，致力于打造国内顶尖的互联网<br/>金融生态平台。
                    p 金蛋理财拥有雄厚的技术实力，自主研发了智能风控系统—神盾，为用户审慎筛选优质债权，同时拥有多项自主研发的软件系统，均获得国家<br/>版权局认证。
                    p 在债权对接上，金蛋理财通过经营情况、合规建设、投资背景、团队稳定性等多维度标准，优选第三方资产方以拓展资产端资源。目前主要选<br/>择消费金融领域排名前列、风险更低、几乎不受经济周期波动影响的个人消费信贷。金蛋理财作为P2P行业的合规先行者，早于监管要求，率<br/>先于2016年8月接入银行存管，实现用户资金与平台自有资金分账管理，全流程不触碰用户资金，打磨出更有保障更安心的理财服务体验。<br/>3年来，凭借良好的行业口碑、扎实的金融科技功底以及优质的理财体验，金蛋理财已成为行业标杆企业，获得在线理财稳健发展企业、2017年<br/>最具投资价值奖等多项行业荣誉。
                    h3 办公环境
                    .environment(@mouseout="op.op1 = op.op2 = op.op3 =op.op4 = false")
                        img(src="./img/i1.png" @mouseover="op.op2 = op.op3 =op.op4 = true", :class="{op:op.op1}")
                        img(src="./img/i2.png" @mouseover="op.op1 = op.op3 =op.op4 = true", :class="{op:op.op2}")
                        img(src="./img/i3.png" @mouseover="op.op1 = op.op2 =op.op4 = true", :class="{op:op.op3}")
                        img(src="./img/i4.png" @mouseover="op.op1 = op.op2 =op.op3 = true", :class="{op:op.op4}")
                    p.tips_bottom *以上数据均来自金蛋内部统计，获奖均在公司荣誉页面展示

                div.basic_information.content(v-if="routerId == 1")
                    h3 基本信息
                    table
                        tr
                            td 公司全称及简称
                            td 全称： 北京钱得乐科技有限公司<br/>简称： 金蛋理财
                        tr
                            td 注册、实缴资本
                            td 5000万
                        tr
                            td 成立时间
                            td 2014-11-25
                        tr
                            td 注册地址
                            td 北京市朝阳区北辰西路8号院3号楼1至14层101内5层601号
                        tr
                            td 法定代表人
                            td 贾鹏
                        tr(style="height:60px;line-height:60px;")
                            td 股东信息
                            td(style="padding:18px 50px;") 南京金蛋科技股份有限公司 100%
                        tr
                            td 经营范围
                            td 技术开发、技术咨询、技术服务；计算机系统服务；数据处理（数据处理中的银行卡中心、PUE<br/>值在1.5以上的云计算数据中心除外）；基础软件服务；应用软件服务；企业管理咨询；投资咨<br/>询；经济贸易咨询；企业策划。（企业依法自主选择经营项目，开展经营活动；依法须经批准的<br/>项目，经相关部门批准后依批准的内容开展经营活动；不得从事本市产业政策禁止和限制类项目<br/>的经营活动）
                        tr
                            td 员工人数
                            td 407人
                        //-.line
                        tr
                            td 分支机构全称
                            td 北京钱得乐科技有限公司朝阳分公司
                        tr
                            td 分支机构所在地
                            td 北京市朝阳区北辰西路8号院3号楼1至14层101内5层0605
                        tr
                            td 分支机构成立时间
                            td 2016-06-03
                        tr
                            td 分支机构主要负责人姓名
                            td 贾鹏
                        tr
                            td 分支机构联系电话
                            td 400-665-0371
                        tr
                            td 投诉电话
                            td 400-665-0371
                        tr
                            td 员工人数
                            td 15人
                    .jiagou
                        img(src="./img/jiagou.png")


                //-团队介绍
                .team_introduction.content(v-if="routerId == 2")
                    h3 管理团队
                    .title 一流的创业团队，平均8年以上的行业经验，拥有卓越的金融、风控、大数据、互联网技术与营销能力。
                    dl
                        dt
                            img(src="./img/jia.png")
                        dd
                            .head
                                strong 贾鹏
                                span 创始人
                                span 首席执行官
                            p 全面负责集团战略规划、运营管理、人才培养和文化建设。<br/>深耕金融及资本运作十余年，2005年开启创业生涯，先后涉足商品贸易、高端商务车辆租赁、旅游公司、民间金融等领域，是连续创业成功者的典范，其中，2010年起先后成立百乘租车、百乘旅游、百乘小贷是贾鹏创业成功的突出成绩，企业盈利能力极强。不满足于现状的贾鹏在创业十年后瞄准互联网金融领域，并成功转型，2015年先后创立了金蛋理财、房互网。2017年贾鹏整合旗下金融子品牌，成立以大数据、人工智能和风控开放平台为核心能力的百乘金科集团，集团致力于通过融合创新提供综合型金融科技服务，被外界认为是最有潜力成长为互联网金融新一代领军企业之一。2018年，贾鹏个人被评为“胡润新金融行业·年度新锐人物”。
                    dl
                        dt
                            img(src="./img/deng.png")
                        dd
                            .head
                                strong 邓巍
                                span 联合创始人
                                span 首席战略官
                            p 主管集团战略规划和资源引入，现任集团董事。<br/>曾任新浪集团业务发展部及品牌部总监、新浪育儿商城总经理，负责新浪集团对外跨行业合作谈判、新商业模式探索；后调任新浪育儿商城总经理，他从零开始在北京、成都、深圳、广州建立B2C商城，成为当年国内第二大育儿电子商务公司、团队员工400余人。<br/>邓巍是连续成功创业者，先后创立了基于云存储的工具型产品消息速递，实现PC与手机之间快速文件传递，上线后连续数周蝉联App store排行榜榜首；以及聚合全网视频内容应用的万花筒视频，上线后在100多家同类型产品里进入行业前5名，拥有超过1000万名用户。2015年，他携手贾鹏共同创立金蛋理财。
                    dl
                        dt
                            img(src="./img/du.png")
                        dd
                            .head
                                strong 杜云
                                span 联合创始人
                                span 首席产品官
                            p 清华大学信息艺术设计专业学士学位，信息设计与计算机交叉学科硕士学位。<br/>8年以上互联网从业经验，具有丰富的用户体验、产品规划、运营以及团队管理经验。曾就职于百度、优酷土豆集团、创新工场等互联网公司，在金融服务平台趣店集团担任产品总监，对互联网金融行业、数据风控及人工智能领域有独到见解。
                    dl
                        dt
                            img(src="./img/yin.jpg")
                        dd
                            .head
                                strong 尹佳
                                span 首席运营官
                            p 负责公司业务发展、运营及产品研发。<br/>北京邮电大学工学硕士学位，具有丰富的互联网产品与运营团队管理经验，10年以上互联网行业经验。擅长互联网金融产品设计、运营体系搭建、拥有较强平台系统架构和产品搭建能力，曾就职于360、搜狗等大型互联网公司，主导多个产品设计和开发工作。
                    dl
                        dt
                            img(src="./img/zhang.png")
                        dd
                            .head
                                strong 张忠卫 
                                span 首席风控官 监事
                            p 工商管理专业学士学位，近10年金融行业从业经验，其中有7年以上信用贷款风控管理经验，曾负责搭建数据信用模型体系、六维模型评价体系、基于图普网络与数据的反欺诈模型，通过机器学习和大数据模型处理和识别用户潜在风险与价值，曾任大华银行、搜房网等多家金融机构风控负责人，任职期间负责风控的金融产品坏账率常年保持远低于行业平均水平。
                    dl
                        dt
                            img(src="./img/liu.png")
                        dd
                            .head
                                strong 刘文
                                span 首席财务官
                            p 南开大学金融学学士学位、对外经济贸易大学数量金融硕士学位，中国注册会计师（CPA）。<br/>曾任职于中国中化集团公司（世界五百强企业）财务总部。
                    
                    h3 员工情况
                    .title 作为国内创新性的垂直细分的互联网金融服务平台，金蛋理财凝聚了一群脚踏实地、努力坚持、阳光有梦的互联网及金融行业精英。
                    .bottom
                        img(src="./img/huanxing.png")
                //-资质证书
                .certifications.content(v-if="routerId == 3")
                    h3 资质证书
                    .imgshow
                        div(@click="showZizi = true,ziziIndex = 1")
                            img(src="./img/zi1.png")
                            p 营业执照
                        div(@click="showZizi = true,ziziIndex = 2")
                            img(src="./img/zi2.png")
                            p 增值电信业务经营许可证
                        div(@click="showZizi = true,ziziIndex = 3")
                            img(src="./img/zi3.png")
                            p 信息系统安全等级保证三级证明
                        div(@click="showZizi = true,ziziIndex = 4")
                            img(src="./img/zi4.png")
                            p 中关村高新技术企业
                    .showmask(v-if="showZizi")
                        .close(@click="showZizi = false") X
                        .slider#slider
                            ul.slider-main
                              transition(name="list")
                                li.slider-panel(v-if="ziziIndex == '1'")
                                    img(src="./img/zi1.png")
                              transition(name="list")
                                li.slider-panel(v-if="ziziIndex == '2'")
                                    img(src="./img/zb2.png")
                              transition(name="list")
                                li.slider-panel(v-if="ziziIndex == '3'")
                                    img(src="./img/zb3.png")
                              transition(name="list")
                                li.slider-panel(v-if="ziziIndex == '4'")
                                    img(src="./img/zb4.png")
                            .slider-extra
                                ul.slider-nav
                                    li.slider-item(@mouseover="ziziIndex = 1",:class="{slider_item_selected:ziziIndex == '1'}") 
                                    li.slider-item(@mouseover="ziziIndex = 2",:class="{slider_item_selected:ziziIndex == '2'}") 
                                    li.slider-item(@mouseover="ziziIndex = 3",:class="{slider_item_selected:ziziIndex == '3'}") 
                                    li.slider-item(@mouseover="ziziIndex = 4",:class="{slider_item_selected:ziziIndex == '4'}") 
                            .slider-page
                                a.slider-pre(@click="ziziIndex == 1? ziziIndex = 4: ziziIndex--") <
                                a.slider-next(@click="ziziIndex == 4? ziziIndex = 1: ziziIndex++") >
                //-公司荣誉
                .team_honor.content(v-if="routerId == 4")
                    h3 公司荣誉
                    .imgshow
                        div
                            img(src="./img/jiang8.png")
                            p 2015互联网金融金橙奖—互联网金融影响力平台
                        div
                            img(src="./img/jiang9.png")
                            p 2015中国互联网金融最具竞争力企业
                        div
                            img(src="./img/jiang10.png")
                            p 金典奖—推动行业经济发展·(行业)十大创新企业
                        div
                            img(src="./img/jiang11.png")
                            p 2017中国新金融行业总评榜—在线理财稳健发展企业
                        div
                            img(src="./img/jiang12.png")
                            p 2017年度最具投资价值奖
                        div
                            img(src="./img/jiang1.png")
                            p 经济观察报-卓越在线理财平台
                        div
                            img(src="./img/jiang2.png")
                            p 野马财经-2017最受用户青睐企业
                        div
                            img(src="./img/jiang3.png")
                            p 第七届中国财经峰会-2018企业社会责任典范奖
                        div
                            img(src="./img/jiang4.png")
                            p 华夏时报-2018新金融十佳诚信服务机构
                        div
                            img(src="./img/jiang5.png")
                            p 布谷新金融-年度最佳人气理财平台30强
                        div
                            img(src="./img/jiang6.png")
                            p 胡润财富新金融百强榜-2018新金融行业年度新锐人物
                        div
                            img(src="./img/jiang7.png")
                            p 华夏时报-2018新金融合规发展30强

                //-银行存管
                .bank_depository.content(v-if="routerId == 5")
                    h3 银行存管
                    .title 金蛋理财积极响应监管要求保障投资人资金安全，于2016年8月率先接入银行存管，成为业内极少数接入银行存管的平台之一。
                    .mainpart
                        img(src="./img/jie1.png")
                        img(src="./img/jie2.png")
                        .qe
                            strong 1.
                            span 什么是银行存管
                        p.duli 金蛋理财在存管银行为每个用户设立独立账户，每个用户资金存入个人独立账户，银行根据投资人、借款人的指令和合同约<br/>定，对资金使用、划付进行管理和监督。
                        img(src="./img/jie3.png")
                        .qe
                            strong 2.
                            span 银行存管对金蛋理财用户有哪些好处？
                        .ans
                            .left
                                img(src="./img/jie4.png")
                                p 资金隔离
                                p 金蛋理财只负责撮合投资人与借款人的信<br/>息，资金由银行划转
                            .right
                                img(src="./img/jie5.png")
                                p 信息真实、透明
                                p 金蛋理财债权信息在银行存档，包括借款人<br/>信息、项目信息等，信息透明更进一步
                //-合作机构
                .cooperation_agencies.content(v-if="routerId == 6")
                    h3 合作机构
                    .mainpart
                        dl
                            dt
                                img(src="./img/hz4.png")
                            dd
                                h3 北京市竞天公诚律师事务所
                                p 于九十年代初设立，是中国第一批获准设立的合伙制律师事务所之一。发展至今，竞天公诚已成为中国最具规模和最具强劲实力的综合性律师事务所之一，在资本市场、兼并收购、海外投资、争议解决、私募股权投资等诸多专业领域处于国内领先地位。竞天公诚总部设于北京，并战略性地选择在上海、深圳、成都和香港设立分所，其中香港分所与孖士打律师行（Mayer Brown JSM）联营，以便本所更好的在境内外为我们的客户提供全方位的法律服务。
                        dl
                            dt
                                img(src="./img/hz5.png")
                            dd
                                h3 同盾科技有限公司
                                p 成立于2013年，总部位于浙江杭州，是国内专业的第三方智能风险管理服务提供商。自创立以来，同盾始终坚持“跨行业联防联控”的理念，将人工智能与风险管理深度结合，为非银行信贷、银行、保险、基金理财、三方支付、航旅、电商、O2O、游戏、社交平台等多个行业客户提供高效智能的风险管理整体解决方案。同盾凭借智能风险管理行业最具商业价值的服务商品牌，也备受国内外顶尖资本机构青睐。截至目前，同盾已获得五轮共计近两亿美金融资，并荣获2015年红鲱鱼全球科技创新100强、福布斯中国互联网金融50强、2017亚洲银行家“最佳云平台应用”等荣誉。
                        dl
                            dt
                                img(src="./img/hz6.png")
                            dd
                                h3 中智诚征信有限公司
                                p 中智诚征信有限公司（下称“中智诚”或“公司”）创始人及团队，在过去的十年中参与了中国征信业的基础建设工作，中智诚团队成员具有深厚的征信行业经验、金融行业管理经验以及跨越中西的征信行业任职背景，在中国征信领域从无到有的发展过程中积累了丰富经验，有着国内其他公司所不具备的优势。
                        dl
                            dt
                                img(src="./img/hz7.png")
                            dd
                                h3 深圳市信联征信有限公司
                                p 成立于2015年4月，是深圳市新国都技术股份有限公司（股票代码：300130）设立的全资子公司，注册资金6000万元，是一家专业的征信服务公司及大数据技术方案提供商。
                                p 2015年9月，信联征信企业征信业务成功通过中国人民银行备案。同年，信联征信系统通过公安部《信息安全等级保护测评（三级）》，达到行业领先水平。
                        dl
                            dt
                                img(src="./img/hz8.png")
                            dd
                                h3 聚信立
                                p 聚信立拥有经验丰富的各类技术专家（曾就职于通用电气、渣打银行、毕马威、Paypal、百度和阿里巴巴等知名企业），在数据分析、消费者行为学、模型开发、产品设计方面有着国际化的视野和项目经验，为客户提供专业、安全的互联网风控技术服务。
                                p 作为互联网风控行业的翘楚，聚信立拥有着一支杰出且专业的团队。高管由原通用电气金融、渣打银行、Paypal、摩根史丹利、毕马威、百度及阿里巴巴等知名企业高管组成，在数据挖掘、消费者行为经济学、模型开发方面拥有着丰富的经验。在大数据分析、云计算、金融模型开发上有着夯实的基础，项目经验遍布美国、日本、韩国、新加坡等全球多个国家。
                .wind_control_process.content(v-if="routerId == 7")
                    a(:href='windcont', target='_blank')
                        img(src="./img/pdf.png")
                    h3 风控流程
                    .mainpart
                        .title 大数据风控体系“神盾” - 为资产保驾护航
                        .bline
                        p.top “神盾”风控系统通过独有的风控模型和信用评价体系，多维度立体审核预判，运用大数据分析系统、量化金融模型以及智能<br/>化算法，以更高效的科技手段全流程监控资产，为蛋友们提供金融服务，有效抵御风险。
                        dl
                            dt
                                .desc
                                    strong 1.
                                    span 大数据风控模型
                                p 通过数据积累、大规模数据分析及深度学习，建立包含2000+维度金融属性特征变<br/>量的风控模型，全面评估借款人信用风险，对借款人打分评级。
                            dd
                                img(src="./img/fengkong1.png")
                        dl
                            dt
                                img(src="./img/fengkong2.png")
                            dd
                                .desc
                                    strong 2.
                                    span 强大的反欺诈能力
                                p 通过多重信息交叉校验，全方位大数据处理信息，对借款人的真实性进行校验并有<br/>效防范欺诈风险。
                        dl
                            dt
                                .desc
                                    strong 3.
                                    span 全流程实时监控
                                p 结合时间、物理设备、人群特征等因素，通过报警、报表、电话回访、人工核查，<br/>风险回顾等手段，进行全流程监控，建立问题快速发现及高效解决机制。
                            dd
                                img(src="./img/fengkong3.png")


                .technical_safely.content(v-if="routerId == 8")
                    h3 技术
                    .title 资深技术团队保障用户隐私
                    .mainpart
                        img(src="./img/js1.png")
                        img(src="./img/js2.png")
                        img(src="./img/js3.png")
                        img(src="./img/js4.png")
                        img(src="./img/js5.png")
                        img(src="./img/js6.png")
                        img(src="./img/js7.png")
                        img(src="./img/js8.png")
                        img(src="./img/js9.png")
                //-运营数据
                .operating_data.content(v-if="routerId == 9")
                    h3 运营数据
                    .mainpart
                        .title 数据概况
                        table
                            tr
                                td
                                    span {{total_money}}
                                    p 累计成交额(元)-截至目前
                                td
                                    span {{operate_days}}
                                    p 运营天数-截至目前
                            tr
                                //td#net_tips
                                    .tips
                                        i#inkey
                                        .words.notshow
                                            p
                                                span 网贷累计借贷金额：
                                                span.number#net_amount
                                            p
                                                span 交易所累计借贷金额：
                                                span.number#exchange_amount
                                td
                                    span {{information_data.total_amount}}
                                    p 累计借贷金额(元)
                                td
                                    span {{information_data.total_count}} 
                                    p 累计借贷笔数
                        .line
                        .title 出借人数据
                        table
                            tr
                                td
                                    span {{information_data.total_lender}}
                                    p 累计出借人数
                                td
                                    span {{information_data.current_lender}}
                                    p 当期出借人数
                        .line
                        .title 借款人数据
                        table
                            tr
                                td
                                    span {{information_data.total_borrower}} 
                                    p 累计借款人数
                                td
                                    span {{information_data.current_borrower}} 
                                    p 当期借款人数
                            tr
                                td
                                    span {{information_data.relation_count}} 
                                    p 关联关系借款笔数
                                td
                                    span {{information_data.relation_balance}} 
                                    p 关联关系借款余额
                        table.spe
                            thead
                                tr
                                    td 网贷前十大借款人姓名
                                    td 未还余额(元)
                                    td 占比
                            tbody#spe
                                tr(v-for="item,index in borrower_data")
                                    td {{item.user_name}}
                                    td {{item.return_amount}}
                                    td {{item.amount_proportion}}

                        .line
                        .title 借款人逾期数据
                        table.third
                            tr
                                td
                                    span {{information_data.overdue}} 
                                    p 逾期率
                                td
                                    span {{information_data.past_count}} 
                                    p 逾期笔数
                                td
                                    span {{information_data.nine_amount}} 
                                    p 逾期90天(不含)以上金额
                            tr
                                td
                                    span {{information_data.nine_count}} 
                                    p 逾期90天(不含)以上笔数
                                td
                                    span {{information_data.loan_amount}} 
                                    p 累计代偿金额
                                td
                                    span {{information_data.loan_count}} 
                                    p 累计代偿笔数



                    .bottom
                        p
                            span *本栏目显示数据，非特别标注，为我司统计值；<br/>*如非特别标注，截止日期为
                            span#deadline 2017年12月31日
                //-运营月报
                .operating_monthly_report.content
                //-收费标准
                .charges.content(v-if="routerId == 11")
                    h3 收费标准
                    table
                        tr
                            td 业务类型
                            td 资费标准
                        tr
                            td 用户注册
                            td 免费
                        tr
                            td 开通存管账户
                            td 免费
                        tr
                            td 充值
                            td 免费
                        tr
                            td 投资
                            td 免费
                        tr
                            td 回款到账
                            td 免费
                        tr
                            td 转出天天金蛋资产
                            td 免费
                        tr
                            td 随心金蛋资产出锁定期转出至出锁定期资产
                            td 免费
                        tr
                            td 提现
                            td 提现手续费为提现金额的0.2%(最低2元，最高50元)，由银行<br/>收取；金蛋理财为普通用户垫付每月前5笔的提现费用，用户享<br/>受每月5次的免费提现机会。


                //-重大事项
                .major_issues.content(v-if="routerId == 12")
                    h3 重大事项
                    table
                        tr
                            td 合并、分立、解散或者申请破产
                            td 无
                        tr
                            td 从业机构受到刑事处罚
                            td 无
                        tr
                            td 公司被责令停业、整顿、关闭
                            td 无
                        tr
                            td 从业机构受到重大行政处罚，或被责令停业、整顿、关闭
                            td 无
                        tr
                            td 重大诉讼或者仲裁事项
                            td 无
                        tr
                            td 实际控制人与持股5%以上的股东、董事、监事、高级管理人员的<br/>变更信息
                            td 持股 5%以上的股东变更：无<br/>董事、监事变更：无<br/>高级管理人员变更：无
                        tr
                            td 实际控制人与持股 5%以上的股东、董事、监事、高级管理人员涉及的<br/>重大诉讼、仲裁事项或者重大行政处罚
                            td 无
                        tr
                            td 公司依法进入破产程序
                            td 无
                        tr
                            td 存在欺诈、损害出借人利益等其他影响网络借贷信息中介机构经营活动的重大事项
                            td 无
                .audit_report.content(v-if="routerId == 13")
                    h3 审计报告
                    .title 我司已按照中国银监会印发的《网络借贷信息中介机构业务活动信息披露指引》要求，将对合规性出具专项核查报告，并于监管规定时间内<br/>公布。
                    h4(@click="jishenbaogao = !jishenbaogao")
                        a.open(href="javascript:;",:class="{'close': jishenbaogao}") 2017年度审计报告
                    .piclist(:class="{'hide': jishenbaogao}")
                        ul
                            li
                                a(href="javascript:;",@click="baogaoId = 'sj1',showmask = showbaogao = true")
                                    img(src="./img/sj1.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'sj2',showmask = showbaogao = true")
                                    img(src="./img/sj2.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'sj3',showmask = showbaogao = true")
                                    img(src="./img/sj3.jpg")
                    h4(@click="zhuanxiangjsbg = !zhuanxiangjsbg")
                        a.open(href="javascript:;",:class="{close: zhuanxiangjsbg}") 2017年度专项审计报告
                    .piclist(:class="{hide: zhuanxiangjsbg}")
                        ul
                            li
                                a(href="javascript:;",@click="baogaoId = 'zxsj1',showmask = showbaogao = true")
                                    img(src="./img/zxsj1.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'zxsj2',showmask = showbaogao = true")
                                    img(src="./img/zxsj2.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'zxsj3',showmask = showbaogao = true")
                                    img(src="./img/zxsj3.jpg")

                .compliance_report.content(v-if="routerId == 14")
                    h3 合规报告
                    .title 我司已按照中国银监会印发的《网络借贷信息中介机构业务活动信息披露指引》要求，将对合规性出具专项核查报告，并于监管规定时间内<br/>公布。
                    h4(@click="heguibaogao = !heguibaogao")
                        a.open(href="javascript:;",:class="{close: heguibaogao}") 2017年度合规报告
                    .piclist(:class="{hide: heguibaogao}")
                        ul
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg1',showmask = showbaogao = true")
                                    img(src="./img/hg1.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg2',showmask = showbaogao = true")
                                    img(src="./img/hg2.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg3',showmask = showbaogao = true")
                                    img(src="./img/hg3.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg4',showmask = showbaogao = true")
                                    img(src="./img/hg4.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg5',showmask = showbaogao = true")
                                    img(src="./img/hg5.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg6',showmask = showbaogao = true")
                                    img(src="./img/hg6.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg7',showmask = showbaogao = true")
                                    img(src="./img/hg7.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg8',showmask = showbaogao = true")
                                    img(src="./img/hg8.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg9',showmask = showbaogao = true")
                                    img(src="./img/hg9.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg10',showmask = showbaogao = true")
                                    img(src="./img/hg10.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg11',showmask = showbaogao = true")
                                    img(src="./img/hg11.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg12',showmask = showbaogao = true")
                                    img(src="./img/hg12.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg13',showmask = showbaogao = true")
                                    img(src="./img/hg13.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg14',showmask = showbaogao = true")
                                    img(src="./img/hg14.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg15',showmask = showbaogao = true")
                                    img(src="./img/hg15.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg16',showmask = showbaogao = true")
                                    img(src="./img/hg16.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg17',showmask = showbaogao = true")
                                    img(src="./img/hg17.jpg")
                            li
                                a(href="javascript:;",@click="baogaoId = 'hg18',showmask = showbaogao = true")
                                    img(src="./img/hg18.jpg")
                //-律师尽调
                .lawyers_effort.content(v-if="routerId == 15")
                    h3 律师尽调
                    .title 我司已按照中国银监会印发的《网络借贷信息中介机构业务活动信息披露指引》要求，将对合规性出具专项核查报告，并于监管规定时间内<br/>公布。
                //-法律法规
                .laws_regulations.content(v-if="routerId == 16")
                    h3 法律法规
                    ul
                        li
                            a.link(href="http://www.cbrc.gov.cn/govView_37D312933F1A4CECBC18F9A96293F450.html" target='_blank') 网络借贷信息中介机构业务活动管理暂行办法
                        li
                            a.link(href="http://www.cbrc.gov.cn/chinese/home/docView/ADBA919718424013997B848840730EB1.html" target='_blank') 网络借贷资金存管业务指引
                        li
                            a.link(href="http://www.cbrc.gov.cn/govView_C8D68D4C980A4410B9F4E21BA593B4F2.html" target='_blank') 网络借贷信息中介机构业务活动信息披露指引
                        li
                            a.link(href="http://www.cbrc.gov.cn/govView_E7B94B41E8C340E4833472632308AEC5.html" target='_blank') 网络借贷信息中介机构备案管理登记指引
                        li
                            a.link(href="http://www.cbrc.gov.cn/chinese/home/docDOC_ReadView/D81B52D3D20A49A99522C48FA8F1C752.html" target='_blank') P2P网络借贷风险专项整治工作实施方案
        transition(name="list")
          div.lightbox( v-if="showmask")
            .mask(@click="showmask = false")
            .baogao(:style="{top: scrollTop + '40px'}")
              img.baogao_img(src=`./img/sj1.jpg`,v-if="baogaoId == 'sj1'")
              img.baogao_img(src=`./img/sj2.jpg`,v-if="baogaoId == 'sj2'")
              img.baogao_img(src=`./img/sj3.jpg`,v-if="baogaoId == 'sj3'")
              img.baogao_img(src=`./img/zxsj1.jpg`,v-if="baogaoId == 'zxsj1'")
              img.baogao_img(src=`./img/zxsj2.jpg`,v-if="baogaoId == 'zxsj2'")
              img.baogao_img(src=`./img/zxsj3.jpg`,v-if="baogaoId == 'zxsj3'")
              img.baogao_img(src=`./img/hg1.jpg`,v-if="baogaoId == 'hg1'")
              img.baogao_img(src=`./img/hg2.jpg`,v-if="baogaoId == 'hg2'")
              img.baogao_img(src=`./img/hg3.jpg`,v-if="baogaoId == 'hg3'")
              img.baogao_img(src=`./img/hg4.jpg`,v-if="baogaoId == 'hg4'")
              img.baogao_img(src=`./img/hg5.jpg`,v-if="baogaoId =='hg5'")
              img.baogao_img(src=`./img/hg6.jpg`,v-if="baogaoId =='hg6'")
              img.baogao_img(src=`./img/hg7.jpg`,v-if="baogaoId == 'hg7'")
              img.baogao_img(src=`./img/hg8.jpg`,v-if="baogaoId == 'hg8'")
              img.baogao_img(src=`./img/hg9.jpg`,v-if="baogaoId == 'hg9'")
              img.baogao_img(src=`./img/hg10.jpg`,v-if="baogaoId == 'hg10'")
              img.baogao_img(src=`./img/hg11.jpg`,v-if="baogaoId == 'hg11'")
              img.baogao_img(src=`./img/hg12.jpg`,v-if="baogaoId == 'hg12'")
              img.baogao_img(src=`./img/hg13.jpg`,v-if="baogaoId == 'hg13'")
              img.baogao_img(src=`./img/hg14.jpg`,v-if="baogaoId == 'hg14'")
              img.baogao_img(src=`./img/hg15.jpg`,v-if="baogaoId == 'hg15'")
              img.baogao_img(src=`./img/hg16.jpg`,v-if="baogaoId == 'hg16'")
              img.baogao_img(src=`./img/hg17.jpg`,v-if="baogaoId == 'hg17'")
              img.baogao_img(src=`./img/hg18.jpg`,v-if="baogaoId == 'hg18'")
              img.close_img(src=`./img/close.png`,@click="showmask = false")
        Vfoot
        Vfixed
</template>

<script>
export default {
  name: "temp",
  data() {
    return {
      title: '信息披露',
      routerId: '0',
      third: '公司简介',
      first: '公司概况',
      jishenbaogao: false,
      zhuanxiangjsbg: true,
      heguibaogao: false,
      op: {
        op1: false,
        op2: false,
        op3: false,
        op4: false,
      },
      information_data: {},
      borrower_data: [],
      total_money: '',
      operate_days: '',
      showmask: false,
      showbaogao: false,
      baogaoId: 'sj1',
      scrollTop: 0,
      clientHeight: 0,
      showZizi: false,
      ziziIndex: 1,
      windcont: require('./img/windcontrolprocess.pdf')
    };
  },
  created() {
    this.$jsonp({
      url: 'http://bm.jindanlicai.com/information/show_information'
    })
      .then(res => {
          this.information_data = res.information_data
          this.borrower_data = res.borrower_data
          this.information_data.total_amount = this.formatData(this.information_data.total_amount)
          this.information_data.net_amount = this.formatData(this.information_data.net_amount)
          this.information_data.exchange_amount = this.formatData(this.information_data.exchange_amount)
      })
      .catch(() => {
          
      })

    this.$jsonp({
      url: location.protocol + '//xwm.jindanlicai.com/new_data_chart/www_chart'
    })
      .then(res => {
          this.total_money = this.formatData(res['total_money'], 1)
          this.operate_days = res['operate_days']
      })
      .catch(() => {
          
      })

    var canRun = true;
    window.addEventListener('scroll', function() {
      if (!canRun) {
            return;
      }
      canRun = false
      setTimeout(function () {
        canRun = true;
        this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      }, 300);
    })
    this.clientHeight = document.documentElement.clientHeight
  },
  mounted() {
    document.setTitle(this.title)
  },
  methods: {
    formatData(data, type) {
      var data2;
      if (type) {
        data2 = (Math.floor(data / 1000000)/10000).toFixed(4).split('.')
      } else {
        data2 = (data / 100000000).toFixed(4).split('.')
      }
      return data2[0]+'亿'+data2[1]+'万'
    }
  }
};
</script>