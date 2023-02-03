<template>
  <div class="audit-detail">
    <a-table
      :class="hasSubItems ? 'table-hassubs' : 'table-nosubs'"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :row-key="(_, index) => index"
      size="middle"
      :defaultExpandAllRows="true"
      :expandIconAsCell="false"
    >
      <template #expandIcon> </template>
      <!-- subtable -->
      <template v-if="hasSubItems" #expandedRowRender="{ record }">
        <a-table
          :columns="record.headings"
          :data-source="record.subItems.items"
          :pagination="false"
          :showHeader="false"
        >
          <template #url="{ text }">
            <template v-if="isURL(text)">
              <a-tooltip :title="text">
                <a :href="text" target="_blank" :alt="text" class="lh-link">
                  {{ parseURL(text).file }}
                </a>
              </a-tooltip>
              <span class="lh-text__url-host"> ({{ parseURL(text).hostname }}) </span>
            </template>
            <template v-else>
              <div class="lh-code">{{ text }}</div>
            </template>
          </template>
          <template #bytes="{ text }">
            <span class="lh-text__bytes">{{ bytesToSize(text) }}</span>
          </template>
          <template #byteskb="{ text }">
            <span class="lh-text__bytes">{{ bytesToSize(text) }}</span>
          </template>
          <template #ms="{ text }">
            <span class="lh-text__bytes">{{ Number(text).toFixed(0) }} ms</span>
          </template>
          <template #numeric="{ text }">
            <span class="lh-text__bytes">{{ Number(text).toFixed(0) }}</span>
          </template>
          <template #msduration="{ text }">
            <span class="lh-text__bytes">{{ formatDuration(Number(text)) }}</span>
          </template>
          <template #thumbnail="{ text }">
            <img class="lh-thumbnail" :src="text" alt="" />
          </template>
          <template #code="{ text }">
            <div class="lh-code" :value="typeof text === 'object' ? text.value : text">
              {{ typeof text === 'object' ? text.value : text }}
            </div>
          </template>
          <template #link="{ text }">
            <link-text :text="text" />
          </template>
          <template #node="{ text }">
            <div v-if="text && text.lhId" :id="text.lhId + columns[0]">{{ renderNode(text) }}</div>
          </template>
          <template #source-location="{ text }">
            {{ text.url }}
          </template>
        </a-table>
      </template>
      <template #url="{ text }">
        <template v-if="isURL(text)">
          <a-tooltip :title="text">
            <a :href="text" target="_blank" :alt="text" class="lh-link">
              {{ parseURL(text).file }}
            </a>
          </a-tooltip>
          <span class="lh-text__url-host"> ({{ parseURL(text).hostname }}) </span>
        </template>
        <template v-else>
          <div class="lh-code">{{ text }}</div>
        </template>
      </template>
      <template #bytes="{ text }">
        <span class="lh-text__bytes">{{ bytesToSize(text) }}</span>
      </template>
      <template #byteskb="{ text }">
        <span class="lh-text__bytes">{{ bytesToSize(text) }}</span>
      </template>
      <template #ms="{ text }">
        <span class="lh-text__bytes">{{ Number(text).toFixed(0) }} ms</span>
      </template>
      <template #numeric="{ text }">
        <span class="lh-text__bytes">{{ Number(text).toFixed(0) }}</span>
      </template>
      <template #msduration="{ text }">
        <span class="lh-text__bytes">{{ formatDuration(Number(text)) }}</span>
      </template>
      <template #thumbnail="{ text }">
        <img class="lh-thumbnail" :src="text" alt="" />
      </template>
      <template #code="{ text }">
        <div class="lh-code">{{ text }}</div>
      </template>
      <template #link="{ text }">
        <link-text :text="text" />
      </template>
      <template #node="{ text }">
        <div v-if="text && text.lhId" :id="text.lhId + index">{{ renderNode(text) }}</div>
      </template>
      <template #source-location="{ text }">
        {{ text.url }}
      </template>
      <!-- <template  #default="{ text }" >
        <span v-if="text.type='subItems'">{{text}}</span>
      </template> -->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import linkText from '../linkText.vue'
import { parseURL, bytesToSize, formatDuration, isURL, handleObjectType } from '../util'

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
//建议框架组件
// console.log(props.details)
const hasSubItems = ref(false)

// const headings = props.details.headings;

//表格列
//TODO:解析headings里面的displayUnit,granularity
//解析headings成columns
const columns = props.details.headings
  ? props.details.headings.map(item => ({
      title: item.label ? item.label : item.text,
      dataIndex: item.key,
      key: item.key + (item.valueType ? item.valueType : item.itemType),
      slots: {
        customRender:
          (item.valueType ? item.valueType : item.itemType) +
          (item.displayUnit ? item.displayUnit : ''),
      },
    }))
  : []
//console.log(columns);
// const items = props.details.items;

//表格数据
//判断每一行是否有子表格，若有，往每一行record里面加入该表格的配置
const dataSource = props.details.items
  ? props.details.items.map(item => {
      if (
        typeof item === 'object' &&
        Object.keys(item).indexOf('subItems') !== -1 &&
        item.subItems !== undefined
      ) {
        hasSubItems.value = true
        item.headings = props.details.headings
          .map(head => head.subItemsHeading)
          .map(col => ({
            dataIndex: col.key,
            key: col.key + (col.valueType ? col.valueType : col.itemType),
            slots: {
              customRender:
                (col.valueType ? col.valueType : col.itemType) +
                (col.displayUnit ? col.displayUnit : ''),
            },
          }))
        item.subItems.items.map(subItem => {
          handleObjectType(subItem)
        })
      }
      handleObjectType(item)
      return item
    })
  : []
//console.log(hasSubItems.value, dataSource);
// .forEach((item)=>{
//   if(Object.keys(item).indexOf('subItems')!==-1){
//     console.log(item)
//     item.headings = headings
//   }
// }):[]

function renderNode(item) {
  nextTick(() => renderNodeDiv(item, item.lhId))
}

/**
 * @param {LH.Audit.Details.NodeValue} item
 * @return {Element}
 */
function renderNodeDiv(item, divName) {
  const node = document.getElementById(divName + props.index)
  //console.log(node)
  const element = document.createElement('span')
  element.className = 'lh-node'
  if (item.nodeLabel) {
    const nodeLabelEl = document.createElement('div')
    nodeLabelEl.textContent = item.nodeLabel
    element.appendChild(nodeLabelEl)
  }
  if (item.snippet) {
    const snippetEl = document.createElement('div')
    snippetEl.classList.add('lh-node__snippet')
    snippetEl.textContent = item.snippet
    element.appendChild(snippetEl)
  }
  if (item.selector) {
    element.title = item.selector
  }
  if (item.path) element.setAttribute('data-path', item.path)
  if (item.selector) element.setAttribute('data-selector', item.selector)
  if (item.snippet) element.setAttribute('data-snippet', item.snippet)
  node && node.appendChild(element)
}
</script>

<style scoped lang="scss">
@import './audit.scss';
</style>
