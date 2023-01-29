<template>
  <Layout class="__main">
    <HuatuoHeader />
    <LayoutContent>
      <RouterView />
    </LayoutContent>
    <HuatuoFooter />
  </Layout>
</template>

<script setup lang="ts">
import { Layout, LayoutContent } from 'ant-design-vue'
import HuatuoHeader from './header.vue'
import HuatuoFooter from './footer.vue'
</script>

<style lang="scss" scoped>
@import './assets/css/theme.scss';
:deep(.ant-btn-primary) {
  background-color: $huatuo-primary-color;
  border-color: $huatuo-primary-color;
}
:deep(span.anticon:not(.app-iconify)) {
  vertical-align: middle;
}
.__main {
  background-color: #f0f0f0;
  // :deep(.vben-layout-content) {
  //   padding-bottom: 0px;
  //   min-height: calc(100vh - 397px);
  // }
  :deep(.ant-layout-content) {
    padding: 1rem;
  }
}
</style>
