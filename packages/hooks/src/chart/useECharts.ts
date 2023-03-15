import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import { useTimeoutFn } from '../core/useTimeout'
import { tryOnUnmounted } from '@vueuse/core'
import { unref, nextTick, watch, computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useEventListener, useBreakpoint } from '../event'
import * as echarts from 'echarts'
import { useLocalStorage,} from '@vben/utils'
// import { useRootSetting } from './setting/useRootSetting';
// import { useMenuSetting } from './setting/useMenuSetting';

const themeState = useLocalStorage('theme', 'light')
export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: String,
) {
  // const { getDarkMode: getSysDarkMode } = useRootSetting();
  // const { getCollapsed } = useMenuSetting();

  const getDarkMode = computed(() => {
    return   themeState.value  //theme === 'default' ? getSysDarkMode.value :
  })
  let chartInstance: echarts.ECharts | null = null
  let resizeFn: Fn = resize
  const cacheOptions = ref({}) as Ref<EChartsOption>
  let removeResizeFn: Fn = () => {}

  resizeFn = useDebounceFn(resize, 200)

  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') {
      return cacheOptions.value as EChartsOption
    }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption
  })

  function initCharts(t = theme) {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }

    chartInstance = echarts.init(el, t)
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn,
    })
    removeResizeFn = removeEvent
    const { widthRef, ScreenValueEnum } = useBreakpoint()
    if (unref(widthRef) <= ScreenValueEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn()
      }, 30)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(getDarkMode.value )
          if (!chartInstance) return
        }
        clear && chartInstance?.clear()
        chartInstance?.setOption(unref(getOptions))
      }, 30)
    })
  }

  function setActions(functions: any = {}, zrenderFunctions: any = {}) {
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) return
        if (Object.keys(functions).length) {
          Object.keys(functions).forEach(key => {
            chartInstance?.on(key, functions[key])
          })
        }
        if (Object.keys(zrenderFunctions).length) {
          Object.keys(zrenderFunctions).forEach(key => {
            chartInstance?.getZr().on(key, params => zrenderFunctions[key](params, chartInstance))
          })
        }
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    })
  }

  watch(
    () => getDarkMode.value,
    theme => {
      if (chartInstance) {
        
        chartInstance.dispose()
        initCharts(theme )
        setOptions(cacheOptions.value)
      }
    },
  )

  // watch(getCollapsed, (_) => {
  //   useTimeoutFn(() => {
  //     resizeFn();
  //   }, 300);
  // });

  tryOnUnmounted(() => {
    if (!chartInstance) return
    removeResizeFn()
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value)
    }
    return chartInstance
  }

  return {
    setOptions,
    resize,
    setActions,
    getInstance,
  }
}
