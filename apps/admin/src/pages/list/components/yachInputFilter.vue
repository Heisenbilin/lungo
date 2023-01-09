<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    placeholder="搜索工号、姓名或用户名"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    :options="data"
    @search="fetchUser"
  >
    <template v-if="fetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { debounce } from '@vben/utils'
import { searchWorkerInfo } from '@/apis/tool'

//知音楼账号检索
export default {
  name: 'YachInputFilter',
  props: {
    noticeValues: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:noticeValues'],
  setup(props, context) {
    let lastFetchId = 0
    const state = reactive({
      data: [],
      //value格式：['account（id)','account(id)']
      value: props.noticeValues,
      fetching: false,
    })

    //监听选中变化，想父组件双向绑定参数传值
    watch(
      () => state.value,
      () => {
        context.emit('update:noticeValues', state.value)
      },
    )

    const fetchUser = debounce(value => {
      // 匹配中文
      const reg = /[^\x00-\xff]/g
      // 匹配数字
      const regNum = /^\d{6}$/g
      // 匹配英文字母 不区分大小写
      const regEng = /^[A-Za-z0-9]{4,}$/g

      const params = reg.test(value)
        ? { name: value }
        : regNum.test(value)
        ? { workcode: value }
        : regEng.test(value)
        ? { account: value }
        : null
      if (params) {
        lastFetchId += 1
        const fetchId = lastFetchId
        state.data = []
        state.fetching = true
        searchWorkerInfo(params).then(result => {
          if (fetchId !== lastFetchId) {
            // for fetch callback order
            return
          }
          state.fetching = false
          state.data =
            result?.data.map(user => ({
              label: `${user.account}(${user.workcode})`,
              value: `${user.account}(${user.workcode})`,
            })) ?? []
        })
        return
      }
    }, 300)
    watch(state.value, () => {
      state.data = []
      state.fetching = false
    })

    return { ...toRefs(state), fetchUser }
  },
}
</script>

<style lang="scss" scoped></style>
