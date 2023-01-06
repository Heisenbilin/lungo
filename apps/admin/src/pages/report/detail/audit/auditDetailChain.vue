<template>
  <div class="lh-crc-container">
    <div class="lh-crc__summary-value">
      <span class="lh-crc__longest_duration_label">关键路径延迟时间上限：</span>
      <span class="lh-crc__longest_duration">
        {{ Number(details.longestChain.duration).toFixed(0) }} ms
      </span>
    </div>
    <div class="lh-crc">
      <div class="crc-initial-nav">初始导航</div>
      <a-tree :tree-data="treeData" :defaultExpandAll="true" showLine>
        <template #treenode="{ record }">
          {{ record.request.url }}
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script>
// import linkText from '../linkText.vue';

//建议框架组件
export default {
  name: 'AuditDetailChain',
  // components: {
  //   linkText,
  // },
  // eslint-disable-next-line vue/require-prop-types
  props: ['details'],
  setup(props) {
    //console.log(props.details);
    const treeData = initTreeNode(props.details.chains);
    //console.log(treeData)
    function initTreeNode(data) {
      let treeNode = [];
      if (data) {
        treeNode = Object.keys(data).map(key => ({
          key: key,
          title: data[key].request.url,
          request: data[key].request,
          children: initTreeNode(data[key].children),
          slots: { customRender: 'treenode' },
        }));
      }
      return treeNode;
    }

    return {
      treeData,
    };
  },
};
</script>

<style scoped lang="scss">
@import './audit.scss';
</style>
