<template>
  <editor
    ref="toastuiEditor"
    :initial-value="value"
    :options="editorOptions"
    :height="height"
    preview-style="vertical"
    @change="onEditorChange"
  />
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css' // codemirror
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import defaultOptions from './default-options'
import '@toast-ui/editor/dist/toastui-editor.css'
import { EditorOptions } from '@toast-ui/editor'
import { Editor } from '@toast-ui/vue-editor'

const defaultId = () => 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')

@Component({
  name: 'MarkdownEditor',
  components: {
    editor: Editor
  }
})
export default class extends Vue {
  @Prop({ required: true }) private value!: string
  @Prop({ default: defaultId }) private id!: string
  @Prop({ default: 'markdown' }) private mode!: string
  @Prop({ default: '300px' }) private height!: string
  @Prop({ default: 'en_US' }) private language!: string
  @Prop({ default: () => defaultOptions }) private options!: EditorOptions

  private editorText = ''
  private markdownEditor?: Editor

  get editorOptions() {
    console.info(this.height)
    const options = Object.assign({}, defaultOptions, this.options)
    options.initialEditType = this.mode
    options.height = this.height
    options.language = this.language
    return options
  }

  private onEditorChange() {
    console.info('onEditorChange:' + (this.$refs.toastuiEditor as Editor).invoke('getMarkdown'))
  }

  @Watch('value')
  private onValueChange(value: string, oldValue: string) {
    this.markdownEditor = (this.$refs.toastuiEditor as Editor)
    this.editorText = value
    if (this.markdownEditor) {
      if (value !== oldValue && value !== this.markdownEditor.invoke('getMarkdown')) {
        this.markdownEditor.invoke('setMarkdown', value)
      }
    }
  }

  @Watch('language')
  private onLanguageChange() {
    console.info('language:')
    this.destroyEditor()
    this.initEditor()
  }

  @Watch('height')
  private onHeightChange(value: string) {
    console.info('height:' + value)
    if (this.markdownEditor !== undefined) {
      this.markdownEditor.invoke('height', value)
    }
  }

  @Watch('mode')
  private onModeChange(value: string) {
    console.info('mode:' + value)
    if (this.markdownEditor !== undefined) {
      this.markdownEditor.invoke('changeMode', value)
    }
  }

  mounted() {
    this.initEditor()
  }

  destroyed() {
    this.destroyEditor()
  }

  private initEditor() {
    this.markdownEditor = this.$refs.toastuiEditor as Editor
    if (this.value) {
      this.markdownEditor.invoke('setMarkdown', this.value)
    }
  }

  private destroyEditor() {
    console.info('destroyEditor:')
    this.markdownEditor = (this.$refs.toastuiEditor as Editor)
    if (!this.markdownEditor) return
    this.markdownEditor.invoke('off', 'change')
    this.markdownEditor.invoke('remove')
    this.markdownEditor = undefined
  }

  public focus() {
    this.markdownEditor = (this.$refs.toastuiEditor as Editor)
    if (!this.markdownEditor) return
    (this.$refs.toastuiEditor as Editor).invoke('focus')
  }

  public setValue(value: string) {
    console.info('setValue:' + value)
    this.markdownEditor = this.$refs.toastuiEditor as Editor
    if (!this.markdownEditor) return
    this.markdownEditor.invoke('setValue', value)
  }

  public getValue() {
    console.info('markdown:' + (this.$refs.toastuiEditor as Editor).invoke('getMarkdown'))
    return (this.$refs.toastuiEditor as Editor).invoke('getMarkdown')
  }

  public setHtml(value: string) {
    (this.$refs.toastuiEditor as Editor).invoke('setHtml', value)
  }

  public getHtml() {
    return (this.$refs.toastuiEditor as Editor).invoke('getHtml')
  }
}
</script>
