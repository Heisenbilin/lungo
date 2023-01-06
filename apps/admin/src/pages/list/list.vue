<template>
  <div class="board">
    <div class="content-list mb-10">
      <ProjectList type="board" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectList from "./components/projectList.vue";
// import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

// const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// const { getCollapsed, toggleCollapsed } = useMenuSetting();
// console.log(getCollapsed.value);
// if (w < 1536 && !getCollapsed.value) {
//   toggleCollapsed();
// }
</script>

<style scoped>
.content-list {
  width: 100%;
  min-height: 50rem;
  padding: 16px;
  background-color: white;
}
</style>
