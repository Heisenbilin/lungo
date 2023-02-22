import { DefineAppConfigOptions } from '@vben/types'
import { PermissionModeEnum } from '@vben/constants'
import { useAppConfig } from '@vben/stores'
import { _assign } from '@vben/utils'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { BasicRoutes } from './routes'
import { unref } from 'vue'
export * from './routes'
export * from './helper'
export * from './guard'
export * from './menus'
export * from './mitt/routeChange'

export interface Stores {
  userStore?: any
  lockStore?: any
  authStore?: any
  appConfig?: DefineAppConfigOptions
}

const WHITE_NAME_LIST: string[] = []
;(() => {
  const getRouteNames = (routeRecords: RouteRecordItem[]) =>
    routeRecords.forEach(item => {
      WHITE_NAME_LIST.push(item.name)
      if (item?.children?.length) {
        getRouteNames(item.children)
      }
    })

  getRouteNames(BasicRoutes)
})()
export let stores: Stores = {}
export let router: Router
export function InitRouter(path: string): Router {
  router = createRouter({
    history: createWebHistory(),
    routes: BasicRoutes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })
  return router
}

// reset router
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

// get query
export function getQuery(): any {
  if (!router) return {}
  return unref(router.currentRoute).query
}

// 增加或者更新路由query
export function addOrUpdateQuery(query) {
  if (!router) return
  const { path, query: oldQuery } = router.currentRoute.value
  router.replace({ path, query: { ...oldQuery, ...query } })
}

// 删除路由query
export function removeQuery(keys: string[] | string) {
  if (!router) return
  const { path, query } = router.currentRoute.value
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      delete query[key]
    })
  } else {
    delete query[keys]
  }
  router.replace({ path, query })
}

export function initGuard(s: Stores) {
  _assign(stores, s)
  stores.appConfig = useAppConfig()
}

export const getPermissionMode = () => {
  return stores.appConfig?.permissionMode
}

export const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK
}
export const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING
}
export const isRoleMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROLE
}
