<template>
  <div class="app-container">
    <div
      id="container"
      class="the-code-editor-container"
      style="height:800px; width:100%"
    />
    <el-button
      style="margin-left: 10px;"
      type="primary"
      @click="submit"
    >
      提交
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as Monaco from 'monaco-editor'

@Component({
  name: 'Java'
})
export default class extends Vue {
  private monacoInstance?: Monaco.editor.IStandaloneCodeEditor

  created() {
    // sd
  }

  mounted() {
    this.monacoInstance = Monaco.editor.create(document.getElementById('container') as HTMLElement, {
      value: '',
      theme: 'vs-dark',
      language: 'java'
    })
  }

  private submit() {
    if (this.monacoInstance !== undefined) {
      console.log(this.monacoInstance.getValue())
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
