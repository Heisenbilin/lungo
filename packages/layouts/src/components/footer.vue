<script lang="ts">
export default { name: 'LayoutFooter' }
</script>
<script lang="ts" setup>
import { CSSProperties, onMounted } from 'vue'
import { computed } from 'vue'
import { createNamespace } from '@vben/utils'
import DutyAid from '@xes/duty-aid';
import { getGlobalConfig } from '@vben/utils';
import { useI18n } from '@vben/locale'

const { t } = useI18n()

const props = defineProps({
  height: {
    type: String,
    default: null,
  },
})
const { bem, cssVarBlock } = createNamespace('footer')
const style = computed(
  () =>
    (props.height
      ? cssVarBlock({ height: props.height })
      : {}) as CSSProperties,
)
// @ts-ignore
const { DUTY_GROUP_ID, DUTY_M_GROUP_ID } = getGlobalConfig(import.meta.env)
onMounted(() => {
  let dutyId;
  if (window.location.host.indexOf('saasz.vdyoo') > -1) {
    dutyId = DUTY_M_GROUP_ID;
  } else {
    dutyId = DUTY_GROUP_ID;
  }
  const dutyobj = new DutyAid({
    groupId: dutyId,
    ele: {
      // ele参数可选，不需要自动生成a标签可以不传ele对象
      eleid: 'connectme', // a标签插入的元素ID
      name: true, //  a标签text 是否显示 人名，默认： true
      workcode: false, //  a标签text 是否显示 工号，默认： true
      separator: ',', // 多个a标签的分隔符 默认： ","逗号
    },
  });
  // 生成A标签列表
  dutyobj.initLinkBox();
});

const curYear = computed(() => new Date().getFullYear());
</script>
<template>
  <footer :class="bem()" :style="style">
    <div class="lh-32px">
      <VbenText depth="3" class="lh-32px">Copyright &copy;©{{ curYear }} 美校事业部-大班云-前端研发部 All Rights Reserved，由
        <a class="link" href="https://cloud.xesv5.com/#/index">未来云</a> 提供计算服务 | 联系我们：
        <span id="connectme" class="mr-3"></span>
        <div class="tooltip">
          问题反馈群
          <img class="tooltipimg"  src="../../../../apps/admin/src/assets/images/feedback.png" />
        </div>
      </VbenText>
    </div>
  </footer>
</template>

<style lang="less" scoped>
footer {
  position: fixed;
  width: calc(100% - 210px);
  bottom: 0px;
  background-color: #fff;
  padding: 5px 0px;
  // padding: var(--footer-padding);
  box-sizing: border-box;
  flex-shrink: 0;
  // height: var(--footer-height);
  text-align: center;
  z-index: 100;
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.tooltipimg {
  // visibility: hidden;
  display:none;
  width: 150px;
  background-color: black;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px;
  position: absolute;
  top: 150%;
  left: 50%;
  margin-left: -60px;
}
.tooltip .tooltipimg::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}

.tooltip:hover .tooltipimg{
  // visibility: visible;
  display:inline;
  transform: translate(20px, -125%);
}
</style>
