<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>
    <el-table
      :data="categoryList"
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
        label="分类ID"
      >
        <template v-slot="scope">
          <span>{{ scope.row.categoryId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="分类名称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.categoryName }}</span>
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
      @pagination="getCategoryList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="categoryTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="分类ID"
          prop="categoryId"
        >
          <el-input
            v-model="categoryTemp.categoryId"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="分类名称"
          prop="categoryName"
        >
          <el-input
            v-model="categoryTemp.categoryName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="status"
        >
          <el-select
            v-model="categoryTemp.status"
            style="width: 300px;"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-loading="loading"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Form } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { ArticleCategory } from '@/api/types'
import {
  defaultArticleCategory, getCategoryList,
  createCategory, updateCategory, deleteCategory
} from '@/api/blog'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ArticleCategory',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private categoryList: ArticleCategory[] = []
  private categoryTemp = defaultArticleCategory
  private total = 0
  private loading = false

  private listQuery = {
    page: 1,
    pageSize: 50
  }

  private textMap = {
    update: '更新分类',
    create: '添加分类'
  }

  private status = ['隐藏', '显示']
  private rules = {
    categoryId: [{ required: true, message: '分类ID必填', trigger: 'change' }],
    categoryName: [{ required: true, message: '分类名称必填', trigger: 'change' }]
  }

  private dialogStatus = ''
  private dialogFormVisible = false

  private statusList = [{ label: '禁用', value: 0 }, { label: '使用', value: 1 }]

  created() {
    this.getCategoryList()
  }

  private async getCategoryList() {
    const { data } = await getCategoryList(this.listQuery)
    this.categoryList = data.categoryList
  }

  private resetTempCategory() {
    this.categoryTemp = Object.assign({}, defaultArticleCategory)
  }

  private handleCreate() {
    this.dialogStatus = 'create'
    this.resetTempCategory()
    this.dialogFormVisible = true
  }

  private handleUpdate(category: ArticleCategory) {
    this.dialogStatus = 'update'
    this.categoryTemp = category
    this.dialogFormVisible = true
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true
        await createCategory(this.categoryTemp)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.dialogFormVisible = false
              this.loading = false
              this.getCategoryList()
            }, 0.5 * 1000)
          }).catch(() => {
            setTimeout(() => { this.loading = false }, 0.5 * 1000)
          })
      }
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true
        await updateCategory(this.categoryTemp.id, this.categoryTemp).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.dialogFormVisible = false
            this.loading = false
            this.getCategoryList()
          }, 0.5 * 1000)
        }).catch(() => {
          setTimeout(() => { this.loading = false }, 0.5 * 1000)
        })
      }
    })
  }

  private async deleteArticle(id: number) {
    await deleteCategory(id)
  }

  private deleteConfirm(category: ArticleCategory) {
    this.$confirm('确定删除该分类?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteArticle(category.id)
      this.getCategoryList()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
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
