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
            <a-breadcrumb-item>{{ boardInfoState.project_name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
      <boardInfo platformType="huatuo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/store/modules/board'
import { storeToRefs } from 'pinia'
import boardInfo from './board.vue'
const boardStore = useBoardStore()

const { boardInfoState } = storeToRefs(boardStore)
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
    }
  }
}
</style>
