<template>
  <a-modal v-model:visible="groupVisible" width="1000px" @cancel="handleCancel" title="用户组管理" :footer="null">
    <UserGroup :base-url="baseURL" :before-delete-user="beforeDeleteUser" />
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AntVue3UserGroup as UserGroup } from '@xes/uc';
// import { useStore } from 'vuex';

import { useListStore } from '@/store/modules/list';
import { useCheckUserAuth } from '@/hooks/board/useCheckUserAuth';

const store = useListStore();
const groupVisible = ref<boolean>(store.ucGroupVisible);

const baseURL = computed(() => {
  if (['huatuo.xesv5.com', 'etapi.xesv5.com'].includes(location.host)) {
    return '/htmonitor/app/web/v1/ht';
  }
  return '/v1/ht';
});

function handleCancel() {
  store.ucGroupVisible = false;
  // store.dispatch('actGetUCGroups');
}

const { beforeDeleteUser } = useCheckUserAuth();

</script>
