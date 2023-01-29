<template>
  <span v-show="showUser">
    <!-- <a-button class="auth-btn" type="link" @click="applyFn">权限申请</a-button> -->
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        <a-avatar :size="36" :src="avatar" />
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a @click="handleLogout">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span class="username">{{ username }}</span>
  </span>
</template>

<script setup lang="ts">
import { Cookie } from '@vben/utils'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

defineProps({
  avatar: {
    type: String,
  },
  username: {
    type: String,
    default: '',
  },
})
const showUser = ref(false)

onMounted(() => {
  showUserFn()
})
const handleLogout = () => {
  userStore.logout(true)
}
const showUserFn = () => {
  const _token = Cookie.get('100TAL_TICKET')
  // console.log('100TAL_TICKET', _token)
  if (_token) {
    showUser.value = true
  }
}
</script>

<style lang="scss" scoped>
@import './assets/css/theme.scss';
.username {
  font-size: 12px;
}

.auth-btn {
  padding: 0;
  margin-right: 6px;
  font-weight: 500;
}

// 更改为华佗主题
.ant-btn-link {
  color: $huatuo-primary-color;
}
</style>
