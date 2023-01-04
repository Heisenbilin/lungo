<template>
  <div class="codemirror">
    <div id="monaco" ref="monacoRef" v-if="showMonaco" :class="styleClass"></div>
  </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { watch, ref, unref, onMounted, nextTick } from 'vue';

const props = defineProps({
  errorContent: {
    type: Object,
  },
  codeStr: {
    type: String,
    default: '',
  },
  styleClass: {
    type: String,
    default: '!h-44',
  },
  lineNumbers: {
    type: Boolean,
    default: true,
  },
});
const showMonaco = ref(true);
const monacoRef:any = ref(null);
let monacoInstance:any = null;
onMounted(() => {
  initData();
});
watch(
  () => [props.errorContent, props.codeStr],
  () => {
    nextTick(() => {
      initData();
    });
  },
  { deep: true }
);
function initData() {
  if (props.errorContent || props.codeStr) {
    const str = props.errorContent ? JSON.stringify(props.errorContent, null, 2) : props.codeStr;
    if (monacoInstance) {
      monacoInstance.setValue(str);
      return;
    }
    monacoInstance = monaco.editor.create(unref(monacoRef), {
      value: str,
      language: 'javascript',
      lineNumbers: props.lineNumbers,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
      scrollbar: {
        alwaysConsumeMouseWheel: false, // defaults is true, false enables the behavior you describe
      },
      readOnly: true,
      height: 260,
      // occurrencesHighlight: 8,
    });
  }
}
</script>
