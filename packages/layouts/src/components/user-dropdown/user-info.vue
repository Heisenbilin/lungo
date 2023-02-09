<script lang="ts" setup>
import { computed } from 'vue'
import { context } from '../../../bridge'
import headerImg from '@/assets/images/header.jpg'
const { useUserStore, useAppInject } = context

const userStore = useUserStore()

const { getIsMobile } = useAppInject()

const getUserInfo = computed(() => {
  const { name = '', avatar } = userStore.userInfo || {}
  return { name, avatar: avatar || headerImg }
})
</script>
<template>
  <div class="flex cursor-pointer">
    <img :src="getUserInfo.avatar" class="avatar w-6 h-6 mr-3" alt="avatar" />
    <span v-if="!getIsMobile">{{ getUserInfo.name }}</span>
  </div>
</template>
<style scoped>
.avatar {
  border-radius: 50%;
}
</style>
