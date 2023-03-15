<template>
  <a-layout>
    <a-layout-header class="bg-white!">
      <div class="w-full h-full flex justify-end h-8 gap-8 2xl:gap-24 items-center px-40">
        <a @click="() => jumpTo('home')" class="text-gray-700">首页</a>
        <a href="https://app.xesv5.com/doc" target="_blank" class="text-gray-700">文档</a>
        <a @click="() => jumpTo('product')" class="text-gray-700">产品介绍</a>
        <a @click="() => jumpTo('users')" class="text-gray-700">客户案例</a>
        <a @click="() => jumpTo('aboutus')" class="text-gray-700">关于我们</a>
      </div>
    </a-layout-header>
    <a-layout-content class="bg-white!">
      <div class="pb-10" id="home">
        <div class="flex justify-center pt-30 pb-5 pl-20 items-baseline gap-5">
          <div class="text-9xl italic font-mono font-bold text-cyan-700">Sway</div>
          <div class="text-9xl italic font-mono font-bold text-green-700">Det</div>
          <div class="text-xl italic text-gray-700">大前端思维侦探</div>
        </div>
        <div class="flex justify-center gap-24 pb-2">
          <button
            class="text-white py-2 px-8 rounded-2 text-lg border-0 bg-green-700 hover:bg-green-600"
          >
            <router-link to="/monitor" class="text-white hover:text-white">快速开始</router-link>
          </button>
          <button
            class="text-white py-2 px-8 rounded-2 text-lg border-0 bg-cyan-700 hover:bg-cyan-600"
          >
            <a href="https://app.xesv5.com/doc" target="_blank" class="text-white hover:text-white">
              查看文档
            </a>
          </button>
        </div>
      </div>
      <a-divider />
      <div class="py-10" id="product">
        <div class="flex-center text-2xl">Web前端监控</div>
        <div class="flex-center gap-10 py-4">
          <a href="https://app.xesv5.com/doc/pages/fedata/" target="_blank" class="text-gray-700">
            了解更多 >
          </a>
          <router-link to="/monitor" class="text-gray-700"> 开始使用 > </router-link>
        </div>
        <div class="flex-center">
          <img src="https://static0.xesimg.com/swaydet-prod/assets/images/web.png" class="w-3/5" />
        </div>
      </div>
      <a-divider />
      <div class="py-10">
        <div class="flex-center text-2xl">客户端监控</div>
        <div class="flex-center gap-10 py-4">
          <a href="https://app.xesv5.com/doc/pages/fedata/" target="_blank" class="text-gray-700">
            了解更多 >
          </a>
          <a
            href="https://fedata.xesv5.com/#/client/entrance"
            target="_blank"
            class="text-gray-700"
          >
            开始使用 >
          </a>
        </div>
        <div class="flex-center">
          <img
            src="https://static0.xesimg.com/swaydet-prod/assets/images/client.png"
            class="w-2/5"
          />
        </div>
      </div>
      <a-divider />
      <div class="flex py-6">
        <div class="w-1/2">
          <div class="flex-center text-xl">小程序监控</div>
          <div class="flex-center gap-10 py-4">
            <a href="https://app.xesv5.com/doc/pages/fedata/" target="_blank" class="text-gray-700">
              了解更多 >
            </a>
            <router-link to="/monitor" class="text-gray-700"> 开始使用 > </router-link>
          </div>
          <div class="flex-center">
            <img
              src="https://static0.xesimg.com/swaydet-prod/assets/images/mini-app.png"
              class="w-7/8"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="flex-center text-xl">白屏放火</div>
          <div class="flex-center gap-10 py-4">
            <a href="https://app.xesv5.com/doc/pages/index/" target="_blank" class="text-gray-700">
              了解更多 >
            </a>
            <a href="https://app.xesv5.com/fanghuo" target="_blank" class="text-gray-700">
              开始使用 >
            </a>
          </div>
          <div class="flex-center">
            <img
              src="https://static0.xesimg.com/swaydet-prod/assets/images/fire.png"
              class="w-3/4"
            />
          </div>
        </div>
      </div>
      <a-divider class="mb-0!" />
      <div class="py-12 bg-gray-100 px-50" id="users">
        <div class="flex-center text-2xl">他们都在使用我们</div>
        <img
          class="w-full pt-8"
          src="https://static0.xesimg.com/swaydet-prod/assets/images/users/sls5zth1gf.png"
        />
        <!-- <div class="grid grid-cols-6 gap-10 pt-10 px-20">
          <div v-for="item in userList" class="flex-center border-1 border-gray-400 border-solid">
            <a :href="item.link" target="_blank"
              ><img :src="item.img" class="w-full max-h-18 p-2"
            /></a>
          </div>
        </div> -->
      </div>
    </a-layout-content>
    <a-layout-footer class="bg-gray-700!" id="aboutus">
      <span class="lh-32px text-white flex-center">
        Copyright &copy;{{ curYear }} 美校事业部-大班云-前端研发部 All Rights Reserved，由
        <a class="link" href="https://cloud.xesv5.com/#/index">未来云</a> 提供计算服务 | 联系我们：
        <span id="connectme" class="mr-3"></span>
        <a-tooltip>
          <template #title><img class="w-40" :src="feedbackImg" /></template>
          问题反馈群
        </a-tooltip>
      </span>
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { computed } from 'vue'
import DutyAid from '@xes/duty-aid'
import { getGlobalConfig } from '@vben/utils'
import feedbackImg from '@/assets/images/feedback.png'

// @ts-ignore
const { DUTY_GROUP_ID, DUTY_M_GROUP_ID } = getGlobalConfig(import.meta.env)
onMounted(() => {
  let dutyId
  if (window.location.host.indexOf('saasz.vdyoo') > -1) {
    dutyId = DUTY_M_GROUP_ID
  } else {
    dutyId = DUTY_GROUP_ID
  }
  const dutyobj = new DutyAid({
    groupId: dutyId,
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

const curYear = computed(() => new Date().getFullYear())

// 跳转页面中某个div函数
const jumpTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// const userList = [
//   {
//     img: 'https://cloud.tal.com/index/img/xes_wangxiao.png',
//     link: 'https://cloud.tal.com/index/img/xes_wangxiao.png',
//   },
//   {
//     img: 'https://cloud.tal.com/index/img/xes_ydy.png',
//     link: 'https://cloud.tal.com/index/img/xes_wangxiao.png',
//   },
//   {
//     img: 'https://static0.xesimg.com/swaydet-prod/assets/images/users/kaoyanbang.png',
//     link: 'https://cloud.tal.com/index/img/xes_wangxiao.png',
//   },
// ]
</script>
