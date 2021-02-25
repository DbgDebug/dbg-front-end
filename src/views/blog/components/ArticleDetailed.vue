<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky
        :z-index="10"
        :class-name="'sub-navbar draft'"
      >
        <el-form-item
          prop="title"
          style="width: 360px;margin-bottom: 0px;margin-left: 10px;float:left;"
        >
          <el-input
            id="title"
            v-model="postForm.title"
            :maxlength="100"
            required
            placeholder="标题"
            style="line-height:50px"
          />
        </el-form-item>
        <el-form-item
          prop="author"
          style="width: 360px;margin-bottom: 0px;margin-left: 10px;float:left;"
        >
          <el-input
            id="author"
            v-model="postForm.author"
            :maxlength="100"
            required
            placeholder="作者"
            style="line-height:50px"
          />
        </el-form-item>
        <el-select
          v-model="categoriesSelect"
          style="width: 360px;margin-left: 10px;float:left;"
          class="filter-item"
          multiple
          placeholder="选择分类"
        >
          <el-option
            v-for="item in categories"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          />
        </el-select>
        <el-select
          v-model="postForm.status"
          style="width: 120px;"
          class="filter-item"
        >
          <el-option
            v-for="item in statusSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            placeholder="文章状态"
          />
        </el-select>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitHandle"
        >
          {{ submitLabel }}
        </el-button>
        <el-button
          v-if="isEdit"
          style="margin-left: 10px;"
          type="warning"
          @click="closeDrawer"
        >
          关闭
        </el-button>
      </sticky>
      <div
        class="editor-container"
      >
        <markdown-editor
          ref="markdownEditor"
          v-model="postForm.markdown"
          :value="postForm.markdown"
          :language="language"
          :height="bodyHeight"
        />
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import {
  defaultArticleDetail, defaultArticleCategory,
  createArticle, updateArticle, getCategoryList
} from '@/api/blog'
import Sticky from '@/components/Sticky/index.vue'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import MaterialInput from '@/components/MaterialInput/index.vue'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { ArticleDetail, ArticleCategory } from '@/api/types'
import { Form } from 'element-ui'

@Component({
  name: 'ArticleDetailed',
  components: {
    MarkdownEditor,
    MaterialInput,
    Sticky,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  }
})
export default class extends Vue {
  @Prop({ default: false }) private isEdit!: boolean
  @Prop({ default: () => defaultArticleDetail }) private defaultArticle!: ArticleDetail
  private categoriesSelect: string[] = []
  private categories: ArticleCategory[] = []
  private categoriesTemp: ArticleCategory[] = []
  private categoryTemp: ArticleCategory = defaultArticleCategory
  private loading = false
  private isCreate = !this.isEdit
  private submitLabel = ''
  private bodyHeight = '600px'
  private articleId = 0

  get postForm() {
    return this.defaultArticle
  }

  private validateRequire = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      if (rule.field === 'imageURL') {
        this.$message({
          message: 'Upload cover image is required',
          type: 'error'
        })
      }
      callback(new Error(rule.field + ' is required'))
    } else {
      callback()
    }
  }

  private content = ''
  private html = ''
  private languageTypeList: { [key: string]: string } = {
    en: 'en_US',
    zh: 'zh_CN',
    es: 'es_ES',
    ja: 'ja_JP',
    ko: 'ko_KR'
  }

  private rules = {
    imageURL: [{ validator: this.validateRequire }],
    title: [{ validator: this.validateRequire }],
    author: [{ validator: this.validateRequire }]
  }

  private statusSelect = [{ label: '隐藏', value: 0 }, { label: '公开', value: 1 }]

  created() {
    if (this.isCreate) {
      this.bodyHeight = document.body.clientHeight - 136 + 'px'
    } else {
      this.bodyHeight = document.body.clientHeight - 50 + 'px'
    }
    this.setSubmitLabel()
    this.getCategoryList()
    if (this.defaultArticle.categories !== null) {
      this.defaultArticle.categories.forEach(item => {
        this.categoriesSelect.push(item.categoryId)
      })
    }
  }

  mounted() {
    // FIXES weird focus issue caused by MarkdownEditor
    // window.scrollTo(0, 0)
  }

  private setSubmitLabel() {
    if (this.isCreate) {
      this.submitLabel = '创建'
    } else {
      this.submitLabel = '更新'
    }
  }

  get language() {
    return this.languageTypeList[AppModule.language]
  }

  private async getCategoryList() {
    const { data } = await getCategoryList({ page: 1, pageSize: 1000 })
    this.categories = data.categoryList
  }

  private submitHandle() {
    this.loading = true
    if (this.categoriesSelect.length <= 0) {
      this.$message({
        type: 'error',
        message: '分类不能为空'
      })
      setTimeout(() => {
        this.loading = false
      }, 0.5 * 1000)
      return
    }
    this.postForm.categories = []
    this.categoriesSelect.forEach(categoryId => {
      this.categoryTemp.categoryId = categoryId
      this.postForm.categories.push(Object.assign({}, this.categoryTemp))
    })
    this.postForm.content = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    this.postForm.markdown = (this.$refs.markdownEditor as MarkdownEditor).getValue()
    if (this.isCreate) {
      this.createArticle()
    } else {
      this.updateArticle()
    }
    setTimeout(() => {
      this.loading = false
    }, 0.5 * 1000)
    this.isCreate = false
    this.setSubmitLabel()
  }

  private createArticle() {
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        const { data } = await createArticle(this.postForm)
        this.articleId = data
        this.$notify({
          title: 'Success',
          message: 'The post published successfully',
          type: 'success',
          duration: 2000
        })
        // Just to simulate the time of the request
      } else {
        console.error('Submit Error!')
        return false
      }
    })
  }

  private updateArticle() {
    if (this.articleId === 0) {
      this.$message({
        type: 'error',
        message: '文章未创建无法更新'
      })
      return
    }
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        await updateArticle(this.articleId, this.postForm)
        this.$notify({
          title: 'Success',
          message: 'The put updated successfully',
          type: 'success',
          duration: 2000
        })
        // Just to simulate the time of the request
      } else {
        console.error('Submit Error!')
        return false
      }
    })
  }

  private closeDrawer() {
    this.drawer()
  }

  @Emit('close')
  private drawer() {
    return false
  }
}
</script>

<style lang="scss">
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style lang="scss" scoped>
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
