<template>
  <div class="relative">
    <span class="px-1 text-lg">
      <LoadingOutlined v-if="staring" />
      <a-tooltip :style="{ color: '#b1b1b1' }" title="取消收藏" v-else-if="starFlag">
        <StarFilled :style="{ color: '#f78d2c' }" @click="() => handleProjectStar(false)" />
      </a-tooltip>
      <a-tooltip title="收藏" v-else>
        <StarTwoTone twoToneColor="#b1b1b1" @click="() => handleProjectStar(true)" />
      </a-tooltip>
      <a-tooltip title="修改配置">
        <SettingOutlined style="color: gray" class="ml-2" @click="editProject(projectId)" />
      </a-tooltip>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useStore } from 'vuex';
import { SettingOutlined, LoadingOutlined, StarTwoTone, StarFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { starProject } from '@/apis/list'

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  collectFlag: {
    type: String,
    require: true,
  },
  isStar: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['edit', 'star'])

// const store = useStore();
// const userid = store.state?.userInfo?.account ?? '';
const userid = 'xiongbilin'

// const mapUploadVisible = ref(false);
const collectFlag = props.collectFlag === '1' ? true : false
const starFlag = ref(collectFlag || props.isStar) //项目收藏/非收藏标志
const staring = ref(false) //收藏中

function editProject(projectId) {
  emit('edit', projectId)
}

//处理收藏项目
const handleProjectStar = async flag => {
  staring.value = true
  const result = await starProject({
    user: userid,
    project_id: `${props.projectId}`,
    isCollect: flag ? 1 : 0,
  })
  if (result.stat === 1) {
    emit('star', props.projectId) //告知父组件收藏/取消收藏事件
    starFlag.value = flag
    message.success(`${flag ? '' : '取消'}收藏成功！`)
  } else {
    message.error(`${flag ? '' : '取消'}收藏失败，请重试或联系管理员`)
  }
  staring.value = false
}
</script>
