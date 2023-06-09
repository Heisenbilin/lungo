<template>
  <div class="flex flex-wrap">
    <div class="p-1 w-1/3" v-for="custom in customList">
      <RouterLink to="/monitor/custom">
        <a-card hoverable style="width: 300px">
          <template #actions>
            <setting-outlined />
            <edit-outlined />
          </template>
          <a-card-meta :title="custom.custom_name" :description="custom.custom_desc"> </a-card-meta>
        </a-card>
      </RouterLink>
    </div>
  </div>
  <div class="text-right">
    <a-pagination
      @change="requestCustomList"
      v-model:current="pagination.current"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
      :show-total="total => `共${total}个看板`"
    />
  </div>
</template>
<script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { getCustomList } from '@/apis/custom'
import { onMounted, ref, reactive, watch } from 'vue'

const loading = ref<boolean>(true)
const customList = ref<any>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const requestCustomList = async (page: number, name = '') => {
  loading.value = true
  try {
    const res = await getCustomList({
      name,
      page: page || pagination.current,
      pageSize: pagination.pageSize,
    })
    if (res.stat === 1) {
      customList.value = res.data.list
      pagination.current = page
      pagination.total = res.data.total
    } else {
      customList.value = []
      pagination.total = 0
      pagination.current = 1
    }
  } catch (e) {
    console.log(e)

    customList.value = []
    pagination.total = 0
    pagination.current = 1
  }
}

onMounted(() => requestCustomList(1))

watch(
  () => pagination.current,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  },
)
</script>
