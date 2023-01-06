<template>
  <div v-if="group.title === '优化建议' || group.title === 'Opportunities'" class="lh-audit-group">
    <div class="lh-audit-group__header">
      <span class="lh-audit-group__title">{{ group.title }}</span>
      <span class="lh-audit-group__description"><link-text :text="group.description" /></span>
    </div>
    <div class="lh-load-opportunity__header">
      <div class="lh-load-opportunity__col lh-load-opportunity__col--one">优化建议</div>
      <div class="lh-load-opportunity__col lh-load-opportunity__col--two">
        有望节省的总时间（估算值
      </div>
    </div>
    <template v-for="(audit, key) in audits" :key="key">
      <audit-title :audit="audit" :scale="scale" />
    </template>
  </div>
  <div v-else class="lh-audit-group">
    <div class="lh-audit-group__header">
      <span class="lh-audit-group__title">{{ group.title }}</span>
      <span class="lh-audit-group__description"><link-text :text="group.description" /></span>
    </div>
    <template v-for="(audit, key) in audits" :key="key">
      <audit-title :audit="audit" />
    </template>
  </div>
</template>

<script>
import linkText from '../linkText.vue';
import auditTitle from './auditTitle.vue';
import { caculateScale } from '../util';

//建议框架组件
export default {
  name: 'AuditLayout',
  components: {
    linkText,
    auditTitle,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['audits', 'group'],
  setup(props) {
    // console.log(props.audits)
    // props.audits.forEach(element => {
    //   if(!element.result.details){
    //     console.log(element)
    //   }
    // });
    // if((props.group.title === '优化建议' || props.group.title === 'Opportunities')){
    //   console.log(props.audits)
    // }
    const scale =
      props.group.title === '优化建议' || props.group.title === 'Opportunities'
        ? caculateScale(props.audits)
        : null;

    return {
      scale,
    };
  },
};
</script>

<style scoped lang="scss">
@import './audit.scss';
</style>
