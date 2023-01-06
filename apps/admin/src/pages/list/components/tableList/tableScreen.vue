<template>
  <div class="relative">
    <div class="flex flex-row justify-between">
      <router-link :to="linkToUrl">
        <a-button type="link" class="!w-full">
          <AreaChartOutlined style="color: #7ed591" class="text-lg mr-1" />
          <span class="text-gray-700">监控</span>
        </a-button>
      </router-link>
      <router-link :to="dataBoardUrl">
        <a-button type="link" class="!w-full">
          <PieChartOutlined style="color: #f77f00" class="text-lg mr-1" />
          <span class="text-gray-700">大盘</span>
        </a-button>
      </router-link>
      <div v-if="!isEditProject">
        <router-link :to="reportUrl">
          <a-button v-if="!isEditProject" type="link" class="!w-full">
            <FundOutlined style="color: #f07d70" class="text-lg mr-1" />
            <span class="text-gray-700">周报</span>
          </a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AreaChartOutlined, FundOutlined, PieChartOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

//是否为编辑器应用
const isEditProject = props.project.appid === "1001970";

//点击监控跳转的路由
const linkToUrl = computed(() => {
  if (props.type === "board") {
    return `/projectboard/boardInfo/${props.project.id}`;
  }
  return `/huatuo/board/${props.project.id}`;
});
//点击质量周报按钮跳转的路由
const reportUrl = computed(() => {
  if (["board"].includes(props.type)) {
    return `/projectboard/qcEntry${props.project.id}/:week`;
  }
  return `/huatuo/report/${props.project.id}/:week`;
});

//点击数据大盘按钮跳转的路由
const dataBoardUrl = computed(() => {
  if (["board"].includes(props.type)) {
    return `/projectboard/dataBoard/${props.project.id}`;
  }
  return `/huatuo/data/${props.project.id}`;
});
</script>
