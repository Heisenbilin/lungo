<template>
  <div class="my-2">
    <a-descriptions bordered size="small" :column="2" class="my-2">
      <a-descriptions-item label="错误内容" :span="1">
        {{ source.name ? source.name : '--' }}
      </a-descriptions-item>
      <a-descriptions-item label="源文件" :span="1">
        <a-typography-paragraph v-if="source.source" copyable>
          {{ source.source.replace('webpack:///', '') }}
        </a-typography-paragraph>
        <span v-else>--</span>
      </a-descriptions-item>
      <a-descriptions-item label="line" :span="1">
        {{ source.line ? source.line : '--' }}
      </a-descriptions-item>
      <a-descriptions-item label="column" :span="1">
        {{ source.column ? source.column : '--' }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="codemirror">
      <div id="monaco" ref="monacoRef" style="height: 200px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { editor, Range } from 'monaco-editor'
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { ref, unref, onMounted, nextTick } from 'vue'

const props = defineProps({
  source: {
    type: Object,
    default: () => ({}),
  },
})

const monacoRef: any = ref(null)
let monacoInstance: any = null

onMounted(() => {
  initData()
})

function initData() {
  if (props.source) {
    if (monacoInstance) {
      monacoInstance.setValue(props.source.sourceCode)
      setLineHighlight(props.source.line)
      monacoInstance.revealLineInCenter(props.source.line)
      return
    }
    monacoInstance = editor.create(unref(monacoRef), {
      value: props.source.sourceCode,
      language: 'javascript',
      lineNumbers: true,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      scrollbar: {
        alwaysConsumeMouseWheel: false, //monaco.editor滚到底部后滚动页面配置 https://github.com/microsoft/monaco-editor/issues/2007
      },
      minimap: {
        enabled: false,
      },
      readOnly: true,
      height: 300,
      // occurrencesHighlight: 8,
    })
    nextTick(() => setLineHighlight(props.source.line))
    monacoInstance.revealLineInCenter(props.source.line)
  }
}

const setLineHighlight = line => {
  // 高亮demo https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-rendering-glyphs-in-the-margin
  monacoInstance.deltaDecorations(
    [],
    [
      {
        range: new Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'code-bg',
        },
      },
    ],
  )
}
</script>
<style lang="less">
.codemirror {
  border: 1px solid #eee;
  height: auto;
  // max-height: 320px;
}
/* stylelint-disable-next-line no-duplicate-selectors */
.codemirror {
  .CodeMirror-scroll {
    height: 200px;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
/* stylelint-disable-next-line rule-empty-line-before */
.code-bg {
  background-color: #fbe9eb;
}
</style>
