<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyWord"
        placeholder="标题"
        style="width: 260px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table
      :data="articleList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        width="100px"
        label="ID"
      >
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="标题"
      >
        <template v-slot="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="作者"
      >
        <template v-slot="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="分类"
      >
        <template v-slot="scope">
          <el-tag
            v-for="category in scope.row.categories"
            :key="category.categoryId"
            style="margin-right:5px;"
          >
            {{ category.categoryId }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="最后更新时间"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ scope.row.updateTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="状态"
        width="100"
      >
        <template v-slot="scope">
          <span>{{ status[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="150"
      >
        <template v-slot="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteConfirm(row)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getArticleList"
    />

    <el-drawer
      :title="elDrawerTitle"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :with-header="false"
      size="100%"
    >
      <article-detailed
        :is-edit="isEdit"
        :default-article="articleTemp"
        @close="handleChildValue"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  defaultArticleDetail, getArticleList, getArticle, deleteArticle
} from '@/api/blog'
import { ArticleDetail } from '@/api/types'
import ArticleDetailed from './components/ArticleDetailed.vue'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ArticleList1',
  components: {
    ArticleDetailed,
    Pagination
  }
})
export default class extends Vue {
  private articleList: ArticleDetail[] = []
  private total = 0
  private articleTemp = defaultArticleDetail

  private elDrawerTitle = ''
  private isEdit = false
  private drawer = false
  private direction = 'rtl'

  private status = ['隐藏', '公开']
  private rules = {
    title: [{ required: true, message: 'up必填', trigger: 'change' }],
    author: [{ required: true, message: '房间号必填', trigger: 'change' }]
  }

  private listQuery = {
    keyWord: undefined,
    page: 1,
    pageSize: 20
  }

  created() {
    this.getArticleList()
  }

  private async getArticleList() {
    const { data } = await getArticleList(this.listQuery)
    this.articleList = data.articleList
    this.total = data.total
  }

  private async getArticle(id: number) {
    const { data } = await getArticle(id)
    return data
  }

  private resetArticleTemp() {
    this.articleTemp = defaultArticleDetail
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getArticleList()
  }

  private async handleUpdate(article: ArticleDetail) {
    this.articleTemp = Object.assign({}, await this.getArticle(article.id))
    this.isEdit = true
    this.elDrawerTitle = '更新文章'
    this.drawer = true
  }

  private deleteConfirm(article: ArticleDetail) {
    this.$confirm('确定删除该博客?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteArticleById(article.id)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteArticleById(id: number) {
    await deleteArticle(id)
    this.$message({
      message: '操作成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getArticleList()
    }, 0.5 * 1000)
  }

  private handleChildValue() {
    this.handleClose()
  }

  private handleClose() {
    this.$confirm('确定关闭', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.drawer = false
      this.getArticleList()
    }).catch(() => {
      this.drawer = true
    })
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
