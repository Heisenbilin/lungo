<template>
  <a-modal
    v-model:visible="store.ucGroupVisible"
    width="1000px"
    @cancel="handleCancel"
    title="用户组管理"
    :footer="null"
  >
    <UserGroup base-url="/v1/ht" :before-delete-user="beforeDeleteUser" />
  </a-modal>
</template>

<script setup lang="ts">
import { AntVue3UserGroup as UserGroup } from '@xes/uc'
import { useListStore } from '@/store/modules/list'
import { useCheckUserAuth } from '@/hooks/board/useCheckUserAuth'

const store = useListStore()

//关闭弹窗
function handleCancel() {
  store.ucGroupVisible = false
}
const { beforeDeleteUser } = useCheckUserAuth()
</script>
