<template>
  <div class="createPost-container">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="category"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="分类ID"
          prop="categoryId"
        >
          <el-input
            v-model="category.categoryId"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="分类名称"
          prop="categoryName"
        >
          <el-input
            v-model="category.categoryName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="status"
        >
          <el-select
            v-model="category.status"
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
        <el-button>
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'CategoryDetail'
})
export default class extends Vue {

}
</script>
