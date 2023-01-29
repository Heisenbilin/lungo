<template>
  <a-layout class="huatuo-layout">
    <span class="environmentText">{{ environmentText }}</span>
    <a-layout-header>
      <div class="navbar">
        <a class="navbar-brand">
          <img :src="Logo_HuaTuo" alt="." />
          <span class="hidden-folded inline">华佗</span>
        </a>
      </div>
      <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys" @select="selectMenu">
        <template v-for="(item, index) in menuList">
          <template v-if="item.Children && item.Children.length">
            <a-sub-menu popupClassName="ant-menu-sub-huatuo" :key="index">
              <template #title>
                <AppstoreFilled class="menu-common" v-if="!item.Icon" />
                <i :class="item.Icon"></i>{{ item.Name }}
                <DownOutlined class="submenu-arrow" />
              </template>
              <a-menu-item-group>
                <a-menu-item v-for="item_sub in item.Children" :key="item_sub.Url">
                  {{ item_sub.Name }}
                </a-menu-item>
              </a-menu-item-group>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.Url">
              <AppstoreFilled class="menu-common" v-if="!item.Icon" />
              <i :class="item.Icon"></i>{{ item.Name }}
            </a-menu-item>
          </template>
        </template>

        <!-- 开发调试html -->
        <!-- <a-sub-menu popupClassName="ant-menu-sub-huatuo" :key="'dev'">
          <template #title>
            <i class="iconfont icon-hexinjiankong"></i>端质量监控
            <DownOutlined class="submenu-arrow" />
          </template>
          <a-menu-item-group>
            <a-menu-item key="/app/ios">iOS应用</a-menu-item>
            <a-menu-item key="/app/android">Android应用</a-menu-item>
            <a-menu-item key="/app/pc">PC应用</a-menu-item>
            <a-menu-item key="#/htmonitor/app/web/#/huatuo/index">Web应用</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu> -->
        <!-- 开发调试html -->
      </a-menu>

      <SideBar class="side-bar" :avatar="Avatar" :username="username" />
    </a-layout-header>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AppstoreFilled, DownOutlined } from '@ant-design/icons-vue'
import Logo_HuaTuo from './assets/img/logo-huatuo.png'
import SideBar from './SideBar.vue'
import Avatar from './assets/img/avata.png'
import { getHuatuoMenuList } from '@/apis/list'
import { testMenuList } from './menuTestConfig'
// import { useGlobSetting } from '@/hooks/setting'
//质量监控应用列表

// const store = useStore()
// const username = ref(undefined)
const username = 'xiongbilin'
const menuList = ref<any[]>([])
// const { dpEnv } = useGlobSetting()
const dpEnv: string = 'prod'
const environmentText = ref('')

const selectMenu = ({ item, key }) => {
  if (item.disabled) return
  // 非web应用地址跳到华佗相关路由
  if (key.indexOf('#') != '-1') {
    let _key = key.replace('#', '')
    let _url = `${window.location.origin}${_key}`
    window.location.href = _url
  } else if (key.indexOf('/app') != '-1') {
    window.location.href = `${window.location.origin}/htmonitor#${key}`
  } else {
    window.location.href = `${window.location.origin}/#${key}`
  }
}

const getEnvironmentText = function () {
  if (dpEnv === 'dev') {
    environmentText.value = '开发环境'
  } else if (dpEnv === 'gray') {
    environmentText.value = '灰度环境'
  } else if (dpEnv === 'test') {
    environmentText.value = '测试环境'
  } else {
    environmentText.value = ''
  }
}

onMounted(async () => {
  const app_id = /\.xesv5/.test(window.location.href) ? '6000001' : '6000037' //6000037
  const uid = '313339'
  menuList.value = testMenuList
  // try {
  //   const result = await getHuatuoMenuList({ app_id, uid, is_menu: 1 })
  //   const menus = result.data?.data
  //   if (menus && menus.length) {
  //     menus.sort((a, b) => {
  //       return a.Sort - b.Sort
  //     })
  //     menus.forEach(item => {
  //       if (item.Children && item.Children.length) {
  //         item.Children.sort((a, b) => a.Sort - b.Sort)
  //       }
  //     })
  //     menuList.value = menus
  //   }
  // } catch {
  //   console.log('获取华佗菜单栏接口请求失败')
  // }

  getEnvironmentText()
})

const selectedKeys = ref(['#/htmonitor/app/web/#/huatuo/index'])
</script>
<style lang="scss" scoped>
@import './assets/css/theme.scss';

.menu-common {
  margin-right: 5px;
  font-size: 18px;
}

.submenu-arrow {
  margin-right: 0;
  font-size: 10px;
}

.huatuo-layout {
  position: relative;

  .navbar {
    display: inline-block;

    .navbar-brand {
      display: inline-block;
      vertical-align: middle;
      margin-right: 0;
      padding: 0;

      > img {
        vertical-align: middle;
        display: inline-block;
        width: 50px;
      }

      > span {
        display: inline-block;
        line-height: 1;
        font-size: 22px;
        // margin-left: 10px;
        color: $huatuo-green;
        vertical-align: middle;
      }
    }
  }

  .ant-layout-header {
    height: 60px;
    padding: 0 20px;
    line-height: 60px;
    background: #fff;
    box-shadow: 0 2px 2px rgb(0 0 0 / 3%), 0 1px 0 rgb(0 0 0 / 3%);

    :deep(.ant-menu) {
      display: inline-block;
      margin-left: 70px;
      line-height: 59px;
      color: #909399;
      border-bottom: 0;
      .ant-menu-submenu:hover::after {
        border-bottom: 0px;
        color: $huatuo-green;
      }
      .ant-menu-submenu-selected::after {
        border-bottom: 0px;
      }
      .ant-menu-submenu-open::after {
        border-bottom: 0px;
      }
      .ant-menu-submenu-open {
        color: #909399;
      }
      .ant-menu-submenu-active::after {
        border-bottom: 0px;
      }
      .ant-menu-item-selected::after {
        border-bottom: 0px;
      }
      .ant-menu-item-active::after {
        border-bottom: 0px;
      }
      .ant-menu-submenu-title:hover {
        color: $huatuo-green;
      }

      .submenu-arrow {
        transition: transform 0.3s;
      }

      .ant-menu-submenu:hover {
        color: $huatuo-green;
        border-bottom-color: $huatuo-green;
        .ant-menu-submenu-arrow {
          color: $huatuo-green;
        }
      }

      .ant-menu-item {
        :hover {
          color: $huatuo-green;
          border-bottom: 2px solid $huatuo-green;
        }
      }

      .ant-menu-item-active,
      .ant-menu-item-selected,
      .ant-menu-submenu-active,
      .ant-menu-submenu-selected {
        color: $huatuo-green;
        border-bottom: 2px solid $huatuo-green;

        :hover {
          color: $huatuo-green;
        }
      }

      .ant-menu-submenu-active {
        transition: transform 0.3s;

        .submenu-arrow {
          transform: rotate(180deg);
        }
      }
    }
  }

  .side-bar {
    float: right;
  }
}
</style>

<style lang="scss">
@import 'assets/css/theme.scss';
@import 'assets/css/iconfont.css';

// 华佗样式menu
.ant-menu-sub-huatuo {
  .ant-menu-sub {
    padding: 8px 0;
    color: #fff !important;
    background-color: rgba(12, 162, 142, 0.9) !important;

    .ant-menu-item {
      height: 36px;
      padding: 0 10px;
      margin: 0;
      line-height: 36px;
    }

    .ant-menu-item-active {
      color: #74efde !important;
    }

    .ant-menu-item-selected {
      color: #74efde !important;
      background-color: #068c7a !important;
    }
  }
}

.environmentText {
  position: absolute;
  top: 21px;
  left: 125px;
  font-weight: bold;
}
</style>
