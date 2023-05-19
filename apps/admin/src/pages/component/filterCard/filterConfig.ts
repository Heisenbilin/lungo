import { tabActiveFilters, tabNameConfig } from '@vben/constants'

// 筛选条件作用的tab页
export const filtersActiveTab = (() => {
  const result = {}
  for (let tab in tabActiveFilters) {
    tabActiveFilters[tab].forEach(key => {
      if (result[key]) result[key].push(tabNameConfig[tab])
      else result[key] = [tabNameConfig[tab]]
    })
  }
  return result
})()

export const accessTagConfig = {
  sourcemap: {
    title: 'sourcemap',
    doc: 'https://app.xesv5.com/doc/pages/fedata/sourcemap/sourcemap.html',
  },
  cdn: {
    title: 'cdn',
    doc: 'https://cloud.tal.com/docs/k8s/quick_start/k8s-oss.html',
  },
  resource: {
    title: '资源容错',
    doc: 'http://app.xesv5.com/doc/pages/fedata/url-fallback/intro.html#%E4%BB%8B%E7%BB%8D',
  },
}
