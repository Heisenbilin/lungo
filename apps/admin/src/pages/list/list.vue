<template>
  <div class="board">
    <div class="w-full min-h-4xl p-4 mb-10">
      <ProjectList />
    </div>
  </div>
</template>

<script setup lang="ts" name="List">
import ProjectList from './components/projectList.vue'
// import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

// const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// const { getCollapsed, toggleCollapsed } = useMenuSetting();
// console.log(getCollapsed.value);
// if (w < 1536 && !getCollapsed.value) {
//   toggleCollapsed();
// }
</script>
