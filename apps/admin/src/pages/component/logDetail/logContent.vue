<template>
  <div class="w-full">
    <a-spin size="large" class="loading" v-if="loading" />
    <a-empty v-else-if="!Object.keys(content).length" class="loading" :image="simpleImage" />
    <template v-else>
      <a-descriptions title="摘要信息" bordered size="small" :column="2">
        <template #extra v-if="content.jumpKibana !== undefined">
          <a :href="content.jumpKibana(topicId)" target="_blank">跳转Kibana</a>
        </template>
        <a-descriptions-item
          v-for="(item, index) in content.abstract"
          :label="item.name"
          :key="index"
          :span="item.span || 2"
        >
          <template v-if="item.isHref">
            <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
              <template #title>
                <span class="whitespace-pre-wrap">{{ item.title || '点击跳转' }}</span>
              </template>
              <a-typography-paragraph :copyable="item.copyable">
                <a :href="item.href" target="_blank">
                  {{ item.value }}
                </a>
              </a-typography-paragraph>
            </a-tooltip>
          </template>
          <template v-else-if="item.jsonParse">
            <a-typography-paragraph copyable class="json-parse">
              <VueJsonPretty :data="item.value" :deep="1" />
            </a-typography-paragraph>
          </template>
          <template v-else-if="item.arrayParse">
            <template v-for="(value, i) in item.value" :key="i">
              <a-typography-paragraph :copyable="item.copyable">
                {{ value }}
              </a-typography-paragraph>
            </template>
          </template>
          <template v-else>
            <a-typography-paragraph :copyable="item.copyable">
              {{ item.value }}
            </a-typography-paragraph>
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <br />
      <div v-if="content.performance !== undefined">
        <div class="description-title">页面加载瀑布图</div>
        <WaterfallChart :content="content.performance" />
      </div>
      <a-descriptions
        title="用户信息"
        bordered
        size="small"
        :column="2"
        v-if="content.userInfo !== undefined"
      >
        <a-descriptions-item
          v-for="(item, index) in content.userInfo"
          :label="item.name"
          :key="index"
          :span="item.span || 2"
        >
          {{ item.value }}
        </a-descriptions-item>
      </a-descriptions>
      <br />
      <div v-if="content.tryToGetSourceMapList" class="description-title">
        异常位置
        <a-button class="ml-4" size="small" type="primary" @click="openUploadSourcemapModal"
          >上传sourcemap</a-button
        >
        <a-modal
          v-model:visible="showUploadSourcemapModal"
          title="本地上传sourcemap"
          @ok="handleOk"
          height="45%"
        >
          <a-upload-dragger
            v-model:fileList="sourcemapFileList"
            name="file"
            :before-upload="handleBeforeSourcemapUpload"
            :maxCount="1"
            accept="application/json,.map"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">点击或拖拽上传本地文件</p>
          </a-upload-dragger>
        </a-modal>
      </div>
      <a-tabs v-if="content.tryToGetSourceMapList" v-model:activeKey="activeKey">
        <a-tab-pane key="sourcemap" tab="SourceMap映射源码">
          <a-spin size="large" class="loading" v-if="sourceMapLoading === 'loading'" />
          <a-empty
            v-else-if="sourceMapLoading === 'error'"
            :image="simpleImage"
            description="请求出错"
          >
            <a @click="getSourceMapData">重新请求</a>
          </a-empty>
          <div v-else-if="sourceMapLoading === 'empty'" class="flex flex-col items-center">
            <a-empty :image="simpleImage" description="已接入但无数据，请检查接入状态" />
            <a-tag v-if="msg" color="error" class="w-max">{{ msg }}</a-tag>
          </div>
          <a-empty
            v-else-if="sourceMapLoading === 'notOpen'"
            :image="simpleImage"
            description="项目未接入SourceMap"
          >
            <a-button
              type="primary"
              href="https://app.xesv5.com/doc/pages/fedata/sourcemap/sourcemap.html"
              target="_blank"
            >
              SourceMap接入指南
            </a-button>
          </a-empty>
          <div
            v-else-if="sourceMapLoading === 'success'"
            v-for="(item, index) in sourceMapList"
            :key="index"
          >
            <div class="tool-bar">
              <span class="stack-index">错误序号：{{ index + 1 }}</span>
            </div>
            <SourceCodeArea :source="item" />
          </div>
        </a-tab-pane>
        <a-tab-pane
          v-if="content.stackList?.length"
          key="stack"
          :tab="`堆栈信息(${content.stackList.length})`"
        >
          <div v-for="(item, index) in content.stackList" :key="index">
            <div class="tool-bar">
              <span class="stack-index">错误序号：{{ index + 1 }}</span>
            </div>
            <CodeArea :codeStr="JSON.stringify(item, null, 2)" class="my-2" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Empty, message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
// import { getUrlParams } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { uploadSourcemap, getMappingList } from '@/apis/board/sourceMap'
import { WaterfallChart, CodeArea, SourceCodeArea } from '@vben/components'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { useRoute } from 'vue-router'

const boardStore = useBoardStore()

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const topicId = computed(() => boardStore.topicIdState)
const activeKey = ref('sourcemap')
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE) //空数据图片
const sourceMapLoading = ref('loading') //sourceMap源码加载状态：loading为加载中，notOpen为未开启，empty为数据为空，success为正常数据，error为请求出错
const sourceMapList = ref([])
const sourcemapFileList = ref<any[]>([])
const showUploadSourcemapModal = ref(false)
const openUploadSourcemapModal = () => {
  sourcemapFileList.value = []
  showUploadSourcemapModal.value = true
}
const msg = ref('')
const route = useRoute()
const handleOk = async () => {
  if (sourcemapFileList.value.length < 1) {
    return
  }
  // uploadApi()
  // console.log(sourcemapFileList.value);
  const { projectid } = route.query 
  console.log(projectid);
  
  try {
    const result = await uploadSourcemap(projectid as string, sourcemapFileList.value[0])
    if (result.msg === 'success') {
      showUploadSourcemapModal.value = false
      message.success('上传成功')
    }
  } catch (e) {
    message.error('上传错误，接口调用失败')
  }
}
const handleBeforeSourcemapUpload = file => {
  sourcemapFileList.value.push(file)
  return false
}
watch(sourcemapFileList, value => {
  if (value.length > 1) {
    sourcemapFileList.value.splice(0, value.length - 1)
  }
})

//请求sourcemap数据
const getSourceMapData = async () => {
  sourceMapLoading.value = 'loading'
  try {
    const res = await getMappingList({
      project_id: `${boardStore.boardInfoState.id}`,
      upload_time: props.content.upload_time,
      error_content: props.content.error_content,
    })
    if (res.stat === 1 && res.data) {
      // 如果开启了sourcemap解析
      if (res.data.isSourceOpen === 0) {
        sourceMapLoading.value = 'notOpen'
        return
      }
      if (res.data.originalList?.length) {
        const codeList = res.data.codeList
        const originalList = res.data.originalList
        originalList.forEach(item => {
          item.sourceCode = codeList.find(sub => item.source === sub.source).sourceCode
        })
        sourceMapList.value = originalList
        sourceMapLoading.value = 'success'
        return
      }
      sourceMapLoading.value = 'empty'
    }
    if (res.stat === 0) {
      sourceMapLoading.value = 'empty'
      msg.value = typeof res.msg === 'string' ? res.msg : JSON.stringify(res.msg)
    }
  } catch {
    sourceMapLoading.value = 'error'
  }
}

watch(
  () => props.content,
  val => {
    //若配置中包括sourceMap获取的请求，请求sourceMap数据
    //每一个LogContent单独请求，按需获取数据
    if (val.tryToGetSourceMapList) {
      getSourceMapData()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
:deep(.ant-descriptions-item-label) {
  text-align: left;
  min-width: 120px;
  font-weight: 500;
}

:deep(.ant-descriptions-item-content) {
  min-width: 200px;
  max-width: 700px;
}

:deep(.ant-typography) {
  margin: 0;
}

:deep(table) {
  border-collapse: collapse;
}

.json-parse {
  position: relative;

  :deep(.ant-typography-copy) {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
}

.description-title {
  flex: auto;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sourcemap-upload-tab.ant-tabs {
  :deep(.ant-tabs-content) {
    display: block;
  }
}
</style>
