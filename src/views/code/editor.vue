<template>
  <div class="createPost-container">
    <div class="createPost-container">
      <el-select
        v-model="language"
        style="width: 360px;margin-bottom: 0px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in languageList"
          :key="item.roomid"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        @click="submit"
      >
        提交
      </el-button>
    </div>
    <div
      id="container"
      class="the-code-editor-container"
      width="100%"
      :style="style"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as Monaco from 'monaco-editor'
import Sticky from '@/components/Sticky/index.vue'

@Component({
  name: 'CodeEditor',
  components: {
    Sticky
  }
})
export default class extends Vue {
  private monacoInstance?: Monaco.editor.IStandaloneCodeEditor
  private languageList = [{ key: 'HTML', value: 'html' }, { key: 'JavaScript', value: 'javascript' }, { key: 'Java', value: 'java' }]
  private language = 'html';
  private containerDiv?: HTMLElement | undefined
  private style = { height: '720px' }

  created() {
    // sd
  }

  mounted() {
    const el = document.getElementsByClassName('app-main')
    const h = el.item(0)?.scrollHeight
    if (h !== undefined) {
      this.style.height = (h - 36) + 'px'
    }
    this.containerDiv = document.getElementById('container') as HTMLElement
    this.monacoInstance = Monaco.editor.create(document.getElementById('container') as HTMLElement, {
      value: '',
      theme: 'vs-dark',
      language: this.language,
      automaticLayout: true
    })
  }

  private handleFilter() {
    if (this.monacoInstance) {
      const model = this.monacoInstance.getModel()
      if (model !== undefined && model != null) {
        model.dispose()
      }
      this.monacoInstance.dispose()
      this.monacoInstance = Monaco.editor.create(document.getElementById('container') as HTMLElement, {
        value: '',
        theme: 'vs-dark',
        language: this.language,
        automaticLayout: true
      })
    }
  }

  private resize() {
    this.style.height = '800px'
  }

  private submit() {
    // app-main
    console.log(document.getElementsByClassName('app-main'))
    if (this.monacoInstance !== undefined) {
      // console.log(this.monacoInstance.getValue())
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

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
</style>
