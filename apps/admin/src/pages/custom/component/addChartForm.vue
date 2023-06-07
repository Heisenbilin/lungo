<template>
  <a-form :model="formState" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
    <a-form-item label="看板名称">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="图表宽度">
      <a-checkbox-group v-model:value="formState.type">
        <a-checkbox value="1" name="type">1/3</a-checkbox>
        <a-checkbox value="2" name="type">1/2</a-checkbox>
        <a-checkbox value="3" name="type">全屏</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="项目来源">
      <a-input v-model:value="formState.desc" type="textarea" />
    </a-form-item>
    <a-form-item label="图表选择">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="treeData"
      >
        <template #title="{ title, key }">
          <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
          <template v-else>{{ title }}</template>
        </template>
      </a-tree>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import type { TreeProps } from 'ant-design-vue'
import { ref, watch, reactive, toRaw } from 'vue'

const treeData: TreeProps['treeData'] = [
  {
    title: '页面访问',
    key: '0-0',
    children: [
      {
        title: 'PV',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'UV',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', title: 'sss' }],
      },
    ],
  },
  {
    title: '性能看板',
    key: '0-0',
    children: [
      {
        title: '瀑布图',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: '快/慢开比',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', title: 'sss' }],
      },
    ],
  },
]

const expandedKeys = ref<string[]>(['0-0-0', '0-0-1'])
const selectedKeys = ref<string[]>(['0-0-0', '0-0-1'])
const checkedKeys = ref<string[]>(['0-0-0', '0-0-1'])
watch(expandedKeys, () => {
  console.log('expandedKeys', expandedKeys)
})
watch(selectedKeys, () => {
  console.log('selectedKeys', selectedKeys)
})
watch(checkedKeys, () => {
  console.log('checkedKeys', checkedKeys)
})

interface FormState {
  name: string
  delivery: boolean
  type: string[]
  resource: string
  desc: string
}

const formState: UnwrapRef<FormState> = reactive({
  name: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const onSubmit = () => {
  console.log('submit!', toRaw(formState))
}
</script>
