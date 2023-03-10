<template>
  <div class="content-list mb-15 mr-4 ml-4 mt-6">
    <UserGroup base-url="/v1/ht" :before-delete-user="beforeDeleteUser" />
  </div>
</template>

<script setup lang="ts">
import { AntVue3UserGroup as UserGroup } from '@xes/uc'
import { useCheckUserAuth } from '@/hooks/board/useCheckUserAuth'
const { beforeDeleteUser } = useCheckUserAuth()
</script>
