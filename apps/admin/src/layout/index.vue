<script lang="ts" setup>
import { Layout } from '@vben/layouts'
</script>

<template>
  <layout>
    <template #main>
      <!-- <keep-alive>
        <RouterView />
      </keep-alive>
  -->
  <RouterView>
  <template #default="{ Component, route }">
      <component :is="Component" v-if="route?.meta?.ignoreKeepAlive"></component>
      <KeepAlive v-else>
        <component :is="Component"></component>
      </KeepAlive>
  </template>
</RouterView>
    </template>
  </layout>
</template>


