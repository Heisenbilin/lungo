<template>
  <div
    :id="audit.id"
    :class="'lh-audit ' + getAuditClass(audit.result.score, audit.result.scoreDisplayMode)"
  >
    <details class="lh-expandable-details" @toggle="showOrCloseDetail()">
      <summary v-if="audit.result.details">
        <div
          v-if="audit.result.details.type === 'opportunity'"
          class="lh-audit-opportunity__header"
        >
          <div class="lh-load-opportunity__cols">
            <div class="lh-load-opportunity__col lh-load-opportunity__col--one">
              <span class="lh-audit__score-icon"></span>
              <span class="lh-audit__title">
                <link-text :text="audit.result.title" />
              </span>
            </div>
            <div class="lh-load-opportunity__col lh-load-opportunity__col--two">
              <div class="lh-load-opportunity__sparkline">
                <div class="lh-sparkline">
                  <div class="lh-sparkline__bar" :style="{ width: getsparklineWith() }"></div>
                </div>
              </div>
              <span class="lh-audit__display-text">
                {{ Number(audit.result.details.overallSavingsMs / 1000).toFixed(2) }}s
              </span>
              <span class="lh-audit-detail-icon">
                <UpOutlined v-if="detailShowing" />
                <DownOutlined v-else />
              </span>
            </div>
          </div>
        </div>
        <div v-else class="lh-audit__header">
          <span class="lh-audit__score-icon"></span>
          <span class="lh-audit__title-and-text">
            <span class="lh-audit__title">
              <link-text :text="audit.result.title" />
            </span>
            <span
              v-if="audit.result.displayValue"
              class="lh-audit__display-text lh-audit__display-text-line"
            >
              {{ audit.result.displayValue }}
            </span>
          </span>
          <span class="lh-audit-detail-icon">
            <UpOutlined v-if="detailShowing" />
            <DownOutlined v-else />
          </span>
        </div>
      </summary>
      <div class="lh-audit__description">
        <link-text v-if="audit.result.description" :text="audit.result.description" />
        <div v-if="audit.result.details">
          <audit-detail-table
            v-if="
              audit.result.details.type === 'opportunity' || audit.result.details.type === 'table'
            "
            :details="audit.result.details"
            :index="audit.result.title"
          />
          <audit-detail-chain
            v-if="audit.result.details.type === 'criticalrequestchain'"
            :details="audit.result.details"
          />
        </div>
      </div>
    </details>
  </div>
</template>

<script>
import { ref } from 'vue';
import linkText from '../linkText.vue';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import auditDetailTable from './auditDetailTable.vue';
import auditDetailChain from './auditDetailChain.vue';

//单条建议组件
export default {
  name: 'AuditTitle',
  components: {
    linkText,
    DownOutlined,
    UpOutlined,
    auditDetailTable,
    auditDetailChain,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['audit', 'scale'],
  setup(props) {
    const detailShowing = ref(false);

    function showOrCloseDetail() {
      detailShowing.value = !detailShowing.value;
    }

    //根据audit的重要性赋予不同的class
    function getAuditClass(score, scoreDisplayMode) {
      let rating = 'fail';
      if (scoreDisplayMode === 'manual' || scoreDisplayMode === 'notApplicable') {
        rating = 'pass';
      } else if (scoreDisplayMode === 'error') {
        rating = 'error';
      } else if (score === null) {
        rating = 'fail';
      } else {
        // At this point, we're rating a standard binary/numeric audit
        rating = 'fail';
        if (score >= 0.9) {
          rating = 'pass';
        } else if (score >= 0.5) {
          rating = 'average';
        }
      }
      let className = `lh-audit--${scoreDisplayMode.toLowerCase()}`;
      if (scoreDisplayMode !== 'informative') {
        className = className + ` lh-audit--${rating}`;
      }

      return className;
    }

    function getsparklineWith() {
      return `${(props.audit.result.details.overallSavingsMs / props.scale) * 100}%`;
    }

    return {
      detailShowing,
      showOrCloseDetail,
      getAuditClass,
      getsparklineWith,
    };
  },
};
</script>

<style scoped lang="scss">
@import './audit.scss';
</style>
