<template>
  <div class="page_footer contact">
    <div class="container">
      <div class="row m-b-lg">
        <div class="col-lg-12 text-center">
          <div class="navy-line"></div>
          <h1>Contact Us</h1>
          <p>欢迎您与我们联系，我们将为您提供最好的服务。</p>
        </div>
      </div>
      <div class="row m-b-lg">
        <div class="col-lg-3 col-lg-offset-3">
          <address>
            <strong>
              <span class="navy">美校事业部-大班云-前端研发部</span>
            </strong>
            <br />
          </address>
        </div>
        <div class="col-lg-3">
          <p class="text-color">学而不思则罔,思而不学则殆<br /></p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 text-center">
          <!-- <a href="mailto:aolongyu@tal.com" class="btn btn-primary">邮件联系</a> -->
          <p class="m-t-sm feedback">
            联系我们：
            <span id="connectme"></span>
            <a-tooltip class="tooltip" placement="topLeft">
              <template #title>
                <img class="feedbackImg" src="../../assets/images/huatuo/huatuo-feedback.jpg" />
              </template>
              <a class="link">问题反馈群</a>
            </a-tooltip>
          </p>
          <ul class="list-inline">
            <li>
              <a
                target="_blank"
                href="http://app.xesv5.com/doc/pages/fedata/"
                class="operation-manual"
              >
                Web端质量监控操作手册
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8 col-lg-offset-2 text-center m-t-lg m-b-lg">
          <p><strong>© 学而思网校 & 学而思培优 & 大前端中台 All rights reserved</strong><br /></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DutyAid from '@xes/duty-aid'

onMounted(() => {
  const dutyobj = new DutyAid({
    groupId: '198',
    ele: {
      // ele参数可选，不需要自动生成a标签可以不传ele对象
      eleid: 'connectme', // a标签插入的元素ID
      name: true, //  a标签text 是否显示 人名，默认： true
      workcode: false, //  a标签text 是否显示 工号，默认： true
      separator: ',', // 多个a标签的分隔符 默认： ","逗号
    },
  })
  // 生成A标签列表
  dutyobj.initLinkBox()
})
</script>

<style lang="scss" scoped>
@import './assets/css/theme.scss';
@import './assets/css/iconfont.css';

.contact {
  background-image: url('../../assets/images/huatuo/world_map.png');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  // margin-top: 10px;

  .container {
    margin: 0 auto;
    background-color: transparent;
  }

  address {
    font-size: 13px;
    margin-bottom: 20px;
    font-style: normal;
    line-height: 1.42857143;
    text-align: left;
  }

  strong {
    font-weight: 700;
  }

  span.navy {
    color: $huatuo-footer-green;
  }

  p.text-color {
    color: #676a6c;
    text-align: left;
  }

  p {
    color: #aeaeae;
    font-size: 13px;
    margin-bottom: 10px;
  }

  .row {
    justify-content: center;

    > div {
      display: inline-block;
      padding: 0 30px;
    }

    .operation-manual {
      font-weight: 500;
      color: $huatuo-primary-color;
    }
  }

  .btn-primary {
    background-color: $huatuo-footer-green;
    border-color: $huatuo-footer-green;
    color: #ffffff;
    font-size: 14px;
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 0.25rem;
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    & > li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
    }
  }

  .m-t-sm {
    margin-top: 10px;
  }
}

.text-center {
  text-align: center;
}

.m-b-lg {
  margin-bottom: 30px;

  h1 {
    margin-top: 10px;
    font-size: 30px;
    font-weight: 200;
    color: rgb(103, 106, 108);
    line-height: 33px;
  }
}

.navy-line {
  width: 60px;
  height: 1px;
  margin: 10px auto 0;
  border-bottom: 2px solid $huatuo-footer-green;
}

.page_footer {
  text-align: center;
}

.feedback {
  color: #676a6c !important;

  .link {
    margin-left: 4px;
    text-decoration: underline;
  }

  .link:link {
    color: #676a6c;
  }

  .link:visited {
    color: #676a6c;
  }

  .link:hover {
    color: #424446;
  }

  .feedbackImg {
    width: 180px;
  }

  .tooltip {
    margin-left: 20px;
    color: #676a6c;

    .link:link {
      color: #676a6c;
    }

    .link:visited {
      color: #676a6c;
    }

    .link:hover {
      color: #676a6c;
    }
  }
}

#connectme :deep(.duty-link) {
  color: #676a6c;

  &:hover {
    color: #424446;
    text-decoration: underline;
  }
}
</style>
