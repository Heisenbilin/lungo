<script lang="ts" setup>
import { Layout } from '@vben/layouts'

// import { Layout } from '@vben/grid-layouts'

</script>

<template>
  <layout>
    <template #main>
      <RouterView>
        <template #default="{ Component, route }">
          <component :is="Component" v-if="route?.meta?.ignoreKeepAlive"></component>
          <KeepAlive v-else>
            <component :is="Component"></component>
          </KeepAlive>
        </template>
      </RouterView>

      <!-- <KeepAlive include="List">
  <RouterView>
  </RouterView>
</KeepAlive> -->
    </template>
  </layout>
</template>
