<template>
  <div class="board">
    <div class="content-list mb-10">
      <ProjectList />
    </div>
  </div>
</template>

<script setup lang="ts" name="List">
import ProjectList from './components/projectList.vue'
import { useListStore } from '@/store/modules/list'
import {onMounted,onActivated,onDeactivated} from 'vue'

const listStore = useListStore()
listStore.platform = ''

// import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

// const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// const { getCollapsed, toggleCollapsed } = useMenuSetting();
// console.log(getCollapsed.value);
// if (w < 1536 && !getCollapsed.value) {
//   toggleCollapsed();
// }

</script>
<!-- <script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  // 需要和路由的name一致
  name:"List"
});
</script> -->
<style scoped>
.content-list {
  width: 100%;
  min-height: 50rem;
  padding: 16px;
  background-color: white;
}
</style>
