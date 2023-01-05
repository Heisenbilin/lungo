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

<script setup lang="ts">
//知音楼账号检索
import { ref, watch } from "vue";
import { debounce } from "@vben/utils";
import { searchWorkerInfo } from "@/apis/tool";

const props = defineProps({
  noticeValues: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["update:noticeValues"]);

let lastFetchId = 0;
const value = ref(props.noticeValues);
const data = ref([]);
const fetching = ref(false);

//监听选中变化，想父组件双向绑定参数传值
watch(value, (val) => {
  emits("update:noticeValues", val);
  data.value = [];
  fetching.value = false;
});

const fetchUser = debounce((user) => {
  // 匹配中文
  const reg = /[^\x00-\xff]/g;
  // 匹配数字
  const regNum = /^\d{6}$/g;
  // 匹配英文字母 不区分大小写
  const regEng = /^[A-Za-z0-9]{4,}$/g;

  const params = reg.test(user)
    ? { name: user }
    : regNum.test(user)
    ? { workcode: user }
    : regEng.test(user)
    ? { account: user }
    : null;
  if (params) {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    data.value = [];
    fetching.value = true;
    searchWorkerInfo(params).then((result) => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      fetching.value = false;
      data.value =
        result?.data.map((user) => ({
          label: `${user.account}(${user.workcode})`,
          value: `${user.account}(${user.workcode})`,
        })) ?? [];
    });
    return;
  }
}, 300);
</script>

<style lang="scss" scoped></style>
