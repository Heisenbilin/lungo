<script lang="ts" setup>
import { useAppTheme } from '@vben/hooks'
const { isDark, toggleTheme } = useAppTheme()
const changeTheme = (isDark: boolean) => {
  const rootHtml = document.querySelector('html')
  if (rootHtml && rootHtml?.getAttribute('id') === 'rootHtml') {
    rootHtml.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }
  toggleTheme(isDark)
}
</script>

<template>
  <VbenSpace justify="center">
    <VbenSwitch :value="isDark" @update:value="changeTheme">
      <template #checked-icon>
        <VbenIconify icon="emojione:crescent-moon" hoverPointer />
      </template>
      <template #unchecked-icon>
        <VbenIconify icon="emojione:sun-with-face" hoverPointer />
      </template>
    </VbenSwitch>
  </VbenSpace>
</template>
