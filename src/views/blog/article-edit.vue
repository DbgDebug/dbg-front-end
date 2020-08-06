<template>
  <article-detailed :is-edit="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticleDetailed from './components/ArticleDetailed.vue'

@Component({
  name: 'ArticleEdit',
  components: {
    ArticleDetailed
  }
})
export default class extends Vue {}
</script>
