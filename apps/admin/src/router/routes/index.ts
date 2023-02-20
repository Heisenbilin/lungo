import { RouteRecordItem } from '@vben/types'

const routeModuleRecord = import.meta.globEager('./modules/**/*.ts') as any

const routeModules: RouteRecordItem[] = []

Object.keys(routeModuleRecord).forEach((key) => {
  const routeModule = routeModuleRecord[key].default || {}
  routeModules.push(
    ...(Array.isArray(routeModule) ? [...routeModule] : [routeModule]),
  )
})

export const asyncRoutes = [...routeModules]
