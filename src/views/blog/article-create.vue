<template>
  <article-detailed
    :is-edit="false"
    :default-article="article"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticleDetailed from './components/ArticleDetailed.vue'
import {
  defaultArticleDetail
} from '@/api/blog'
@Component({
  name: 'ArticleCreate',
  components: {
    ArticleDetailed
  }
})
export default class extends Vue {
  private article = defaultArticleDetail
}
</script>
