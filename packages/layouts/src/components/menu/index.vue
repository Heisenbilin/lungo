<script lang="ts" setup>
import { ref, h, onMounted, unref, nextTick } from 'vue'
import { createNamespace, mapTree } from '@vben/utils'
import { VbenIconify } from '@vben/vbencomponents'
import { context } from '../../../bridge'
import {
  RouteLocationNormalizedLoaded,
  RouterLink,
  useRouter,
} from 'vue-router'
import { MenuTypeEnum } from '@vben/constants'
import { useI18n } from '@vben/locale'
import { REDIRECT_NAME } from '@vben/constants'
import { Menu } from '@vben/types'
const { Logo, getMenus, listenerRouteChange, useMenuSetting, useAppInject } = context

const { getMenuType, getAccordion } = useMenuSetting()
const { getIsMobile } = useAppInject()

const props = defineProps({
  mode: {
    type: String,
    default: () => 'vertical',
  },
})
const { bem } = createNamespace('layout-menu')
const { t } = useI18n()
const { currentRoute } = useRouter()
const { getCollapsed, getMenuShowLogo } = useMenuSetting()
const menuRef = ref(null)
const menuList = ref([])
const activeKey = ref()
// 定位菜单选择 与 当前路由匹配
const showOption = () => {
  nextTick(() => {
    if (!menuRef.value) return
    menuRef.value.Ref.showOption()
  })
}
// TODO 静态路由 待实现
onMounted(async () => {
  const menus = await getMenus()
  menuList.value = diffMenu(mapTree(menus, { conversion: (menu) => routerToMenu(menu) })) //做一层数据清洗
  showOption()
})
// todo 递归菜单menu数据结构 清除hideMenu=true的路由信息
function diffMenu(menuList: Menu[]) {
  let res =[]
  menuList.forEach(menu => {
    if (!menu.hideMenu) {
      if(menu?.children?.length){
        menu.children = diffMenu(menu.children)
        res.push(menu)
      }else{
        res.push(menu)
      }
    }
  });
  return res
}

listenerRouteChange((route) => {
  if (route.name === REDIRECT_NAME) return

  const currentActiveMenu = route.meta?.currentActiveMenu as string
  handleMenuChange(route)

  if (currentActiveMenu) {
    activeKey.value = currentActiveMenu
  }
  showOption()
})

async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
  const menu = route || unref(currentRoute)
  activeKey.value = menu.name
}

// 路由格式化
const routerToMenu = (item: RouteRecordItem) => {
  const { name, children, meta, icon } = item
  const title = t(meta.title as string)
  return {
    label: () => {
      if (children) {
        return title
      }
      return h(
        RouterLink,
        {
          to: {
            name,
          },
        },
        { default: () => title },
      )
    },
    key: name,
    hideMenu: meta.hideMenu,  //加上hidemenu 因为routerToMenu 返回的对象里面做了数据改动将hideMenu丢失了
    icon: renderIcon(icon),
  }
}
function renderIcon(icon: string) {
  if (!icon) return undefined
  return () => h(VbenIconify, { icon })
}
</script>

<template>
  <div :class="bem()">
    <logo :class="bem('logo')" v-if="getMenuShowLogo || getIsMobile" :showTitle="!getCollapsed" />

    <VbenScrollbar :class="bem('scrollbar')">
      <VbenMenu v-model:value="activeKey" :options="menuList" :collapsed="getCollapsed" :collapsed-width="48"
        :collapsed-icon-size="22" :indent="18" :root-indent="18" ref="menuRef" :mode="props.mode"
        :accordion="getAccordion" />
    </VbenScrollbar>
  </div>
</template>

<style lang="less" scoped>
.layout-menu {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__logo {
    flex-shrink: 0;
  }

  &__scrollbar {
    flex: 1;
    flex-basis: auto;
  }
}
</style>
