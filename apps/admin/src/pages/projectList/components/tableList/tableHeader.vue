<template>
  <div class="relative">
    <div class="card">
      <router-link class="flex items-center px-0 py-3" :to="linkToUrl" style="width: 100%">
        <a-tag v-if="project.saas === 'yes'" color="red">学科</a-tag>
        <a-tag v-else color="blue">素质</a-tag>
        <span class="ml-2 text-gray-800 text-lg truncate trun-cate w-64">
          {{ project.project_name }}
        </span>
        <a-tag v-if="project.appid === '1001970'" color="cyan">编辑器应用</a-tag>
      </router-link>
      <!-- <alarm-setting
        ref="alarmSetting"
        :project-id="project.id"
        :uc-group-id="project.uc_group_id"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
// import AlarmSetting from '/@/views/pages/projectBoard/alarm/alarm-setting.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  isStar: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  closeDays: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

// const emit = defineEmits(['edit', 'star']);

// const store = useStore();
// const userid = store.state?.userInfo?.account ?? '';

// const mapUploadVisible = ref(false);
//是否为编辑器应用
// const isEditProject = props.project.appid === '1001970';
//点击卡片跳转的路由
const linkToUrl = computed(() => {
  if (props.type === "board") {
    return `/projectboard/boardInfo/${props.project.id}`;
  }
  return `/huatuo/board/${props.project.id}`;
});
// //点击质量周报按钮跳转的路由
// const reportUrl = computed(() => {
//   if (['board'].includes(props.type)) {
//     return `/projectboard/qcEntry${props.project.id}/:week`;
//   }
//   return `/huatuo/report/${props.project.id}/:week`;
// });

// //点击数据大盘按钮跳转的路由
// const dataBoardUrl = computed(() => {
//   if (['board'].includes(props.type)) {
//     return `/projectboard/dataBoard/${props.project.id}`;
//   }
//   return `/huatuo/data/${props.project.id}`;
// });

// const openFlag = ref(false); //项目开启/关闭标志
// const collectFlag = props.project.collectFlag === '1' ? true : false;
// const starFlag = ref(collectFlag || props.isStar); //项目收藏/非收藏标志
// const staring = ref(false); //收藏中

// function showMapUploadModal() {
//   mapUploadVisible.value = true;
// }

//下载配置文件
// function downloadConfig() {
//   //项目没开启sourcemap解析
//   if (props.project.sourcemap_analysis !== 1) {
//     message.error('请先开启sourcemap解析！');
//   } else {
//     //下载文件
//     const downloadUrl = `https://app.xesv5.com/bigfish/v1/interface/getConfigFile?project_id=${props.project.id}`;
//     location.href = downloadUrl;
//     // window.open(downloadUrl);
//   }
// }
</script>

<style lang="scss" scoped>
.card {
  // position: relative;
  display: flex;
  align-items: center;
  margin-right: 0px;
}
:deep(.ant-tag) {
  height: 1.5rem;
}
:deep(a.ant-btn) {
  padding: 0;
}
</style>
