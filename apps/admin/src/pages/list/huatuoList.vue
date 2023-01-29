<template>
  <div class="huatuo">
    <div class="huatuo-content">
      <div class="content-menu">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>
              <router-link :to="'/huatuo/index'">WEB端质量监控</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>主页</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="fedata-menu">
          <div class="menu-block"></div>
          <a-button type="primary" class="menu-item" @click="handleGroupVisible">
            用户组管理
          </a-button>
        </div>
      </div>
      <div class="box">
        <ProjectList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//华佗Web应用监控
import ProjectList from './components/projectList.vue'
import { useListStore } from '@/store/modules/list'
// import { useStore } from 'vuex';
const listStore = useListStore()
listStore.platform = 'huatuo'

// const store = useStore();
const handleGroupVisible = () => {
  listStore.ucGroupVisible = true
  // store.dispatch('actSetUCGroupVisible', true);
}
</script>

<style lang="scss" scoped>
.huatuo {
  width: 100%;

  .huatuo-content {
    .content-menu {
      width: 100%;
      height: 50px;
      background-color: white;
      /*flex 布局*/
      display: flex;
      /*实现垂直居中*/
      align-items: center;
      margin-bottom: 12px;

      .ant-breadcrumb {
        line-height: 14px;
      }

      .breadcrumb {
        padding: 1%;
      }

      .fedata-menu {
        flex: 1;
        background-color: #f0f0f0;

        .menu-block {
          background-color: #fff;
          border-radius: 0 25px 25px 0;
          height: 50px;
          width: calc(100% - 140px);
          float: left;
        }

        .menu-item {
          color: white;
          background-image: linear-gradient(#3397ff, #9cc9ff);
          border-radius: 25px;
          height: 50px;
          width: 120px;
          float: right;
          text-align: center;
          margin-left: 20px;
          border-color: #9cc9ff;
        }
      }
    }

    .box {
      padding: 18px;
      margin-bottom: 12px;
      background-color: #fff;
      box-shadow: 0 0 1px rgb(0 0 0 / 15%);
    }
  }
}
</style>
