<template>
  <div class="relative">
    <div class="card">
      <a-card>
        <template #title>
          <router-link class="flex items-center px-4 py-3" :to="boardUrl">
            <a-tag v-if="project.saas === 'yes'" color="red">学科</a-tag>
            <a-tag v-else color="blue">素质</a-tag>
            <span class="ml-2 text-gray-800 text-lg truncate">
              {{ project.project_name }}
            </span>
          </router-link>
        </template>
        <a-card-meta>
          <template #description>
            <div v-if="project.close_project !== 1 || openFlag" class="h-52">
              <CardContent
                :projectId="project.id"
                :startTime="startTime"
                :endTime="endTime"
                :linkToUrl="boardUrl"
              />
            </div>
            <div v-else class="h-52 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <a-popconfirm
                :title="`由于本项目连续${closeDays}无数据/手动关闭，现已关闭日志采集，确定要开启吗？`"
                ok-text="是"
                cancel-text="否"
                @confirm="openProject(project.id)"
              >
                <a-button type="primary"> <InfoCircleOutlined /> 开启项目 </a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-card-meta>
        <template #extra>
          <a-tooltip
            v-if="latestSDKVersion.length && project.sdk_version !== latestSDKVersion"
            :overlayStyle="{ maxWidth: '300px' }"
            :title="`日志上报SDK可更新至${latestSDKVersion}版本，点击查看`"
            color="orange"
          >
            <a-button
              type="link"
              href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log"
              target="_blank"
            >
              <a-tag color="warning">
                {{ project.sdk_version === '' ? '&lt;2.1.0' : project.sdk_version }}
              </a-tag>
            </a-button>
          </a-tooltip>
          <a-tooltip
            v-else-if="latestSDKVersion.length"
            title="日志上报SDK已经是最新版本了"
            color="green"
          >
            <a-tag color="success">
              {{ project.sdk_version }}
            </a-tag>
          </a-tooltip>
          <a-tag v-if="project.appid === '1001970'" color="cyan">编辑器应用</a-tag>
          <span class="px-1 text-lg">
            <LoadingOutlined v-if="staring" />
            <a-tooltip :style="{ color: '#b1b1b1' }" title="取消收藏" v-else-if="starFlag">
              <StarFilled :style="{ color: '#f78d2c' }" @click="() => handleProjectStar(false)" />
            </a-tooltip>
            <a-tooltip title="收藏" v-else>
              <StarTwoTone twoToneColor="#b1b1b1" @click="() => handleProjectStar(true)" />
            </a-tooltip>
            <a-tooltip title="修改配置">
              <SettingOutlined
                style="color: gray"
                class="ml-1 text-base"
                @click="editProject(project.id)"
              />
            </a-tooltip>
          </span>
          <span
            v-if="appStore.checkIsAdmin('xiongbilin')"
            class="absolute -top-1 right-20 text-gray-200"
          >
            create: {{ moment(project.create_time).format('YY.MM.DD-HH:mm') }}
          </span>
        </template>
        <template v-if="project.close_project !== 1 || openFlag" #actions>
          <!-- <a-tooltip v-if="!isEditProject" title="预警设置">
            <a-button type="link" @click="$refs.alarmSetting.showModal()" class="!w-full">
              <template #icon>
                <AlertTwoTone twoToneColor="#d4542d" key="alarm" />
              </template>
            </a-button>
          </a-tooltip> -->
          <router-link :to="boardUrl">
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
          <!-- lighthouse检测工具 -->
          <!-- <a-tooltip v-if="!isEditProject">
          <template #title>lighthouse检测</template>
          <router-link :to="`/task/${project.id}/lighthouse`">
            <a-button type="link" class="!w-full">
              <template #icon>
                <RocketOutlined style="color: #b60000" key="lighthouse" />
              </template>
            </a-button>
          </router-link>
        </a-tooltip> -->
        </template>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SettingOutlined,
  AreaChartOutlined,
  FundOutlined,
  PieChartOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  StarTwoTone,
  StarFilled,
} from '@ant-design/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useListStore } from '@/store/modules/list'
import { message } from 'ant-design-vue'
import { modifyProjectParams, starProject } from '@/apis/list'
import CardContent from './cardContent.vue'
import moment from 'moment'
import { useLinkToUrl } from '@/hooks/board/useLink'

const appStore = useAppStore()
const listStore = useListStore()

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  isStar: {
    type: Boolean,
    required: true,
  },
  latestSDKVersion: {
    type: String,
    default: '',
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
})

const emit = defineEmits(['edit', 'star'])

//是否为编辑器应用
const isEditProject = props.project.appid === '1001970'
//点击卡片跳转的路由
const boardUrl = useLinkToUrl(props.project.id, 'board')
//点击质量周报按钮跳转的路由
const reportUrl = useLinkToUrl(props.project.id, 'report')
//点击数据大盘按钮跳转的路由
const dataBoardUrl = useLinkToUrl(props.project.id, 'data')

const openFlag = ref(false) //项目开启/关闭标志
const collectFlag = props.project.collectFlag === '1' ? true : false
const starFlag = ref(collectFlag || props.isStar) //项目收藏/非收藏标志
const staring = ref(false) //收藏中

//编辑应用按钮点击处理，告知父组件打开编辑框
function editProject(projectId) {
  emit('edit', projectId)
}

//处理重新打开项目
const openProject = async id => {
  const result = await modifyProjectParams(id, { close_project: 0 })
  if (result.stat === 1) {
    message.success('开启成功！')
    openFlag.value = true
    //刷新另一Tab
    const tabName = props.isStar ? 'all' : 'star'
    listStore.forceFlashFlag[tabName] = !listStore.forceFlashFlag[tabName]
    // store.dispatch('actSetForceFlashFlag', props.isStar ? 'all' : 'star');
  } else {
    message.error('开启失败，请重试或联系管理员')
  }
}

//处理收藏项目
const handleProjectStar = async flag => {
  staring.value = true
  const result = await starProject({
    user: 'xiongbilin',
    project_id: `${props.project.id}`,
    isCollect: flag ? 1 : 0,
  })
  if (result.stat === 1) {
    emit('star', props.project.id) //告知父组件收藏/取消收藏事件
    starFlag.value = flag
    message.success(`${flag ? '' : '取消'}收藏成功！`)
  } else {
    message.error(`${flag ? '' : '取消'}收藏失败，请重试或联系管理员`)
  }
  staring.value = false
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;

  .ant-card-bordered {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  :deep(.ant-card-head-title:hover) {
    opacity: 0.7;
    text-decoration: underline;
  }

  :deep(.ant-btn-link) {
    padding: 0;
    margin: 0;
    border: 0;
    line-height: 0;
    height: 22px;
  }

  :deep(.ant-card-actions) {
    border-radius: 0 0 8px 8px;

    > li {
      margin: 0;
    }

    .ant-btn {
      height: 50px;
    }
  }

  :deep(.ant-card-head) {
    padding: 0 10px 0 0;
    min-height: auto;
  }

  :deep(.ant-card-body) {
    padding: 16px 6px;
  }

  :deep(.ant-card-head-title) {
    padding: 0;
  }

  :deep(.ant-card-head-title:hover) {
    text-decoration: auto;
  }

  :deep(.ant-card-extra) {
    padding: 0;
  }
}
</style>
