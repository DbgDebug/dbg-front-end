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
      v-loading="listLoading"
      :data="serviceList"
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
        width="180px"
        label="服务名称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.serviceName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="显示名称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
      >
        <template v-slot="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="最后更新时间"
      >
        <template v-slot="scope">
          <span>{{ scope.row.updateTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="300"
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
            v-if="row.isUpdate === 1"
            type="primary"
            size="mini"
          >
            更新
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
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempService"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="服务名称"
          prop="serviceName"
        >
          <el-input
            v-model="tempService.serviceName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="显示名称"
          prop="displayName"
        >
          <el-input
            v-model="tempService.displayName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="status"
        >
          <el-select
            v-model="tempService.status"
            placeholder="up"
            style="width: 140px"
            class="filter-item"
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
import { cloneDeep } from 'lodash'
import { defaultService, getServiceList, addService, editService, deleteService } from '@/api/permission'
import { Service } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ServiceList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private serviceList: Service[] = []
  private total = 0
  private listLoading = true
  private tempService = defaultService

  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false;
  private textMap = {
    update: '编辑',
    create: '添加'
  }

  private statusList = [{ label: '禁用', value: 0 }, { label: '使用', value: 1 }]

  private listQuery = {
    serviceName: '',
    page: 1,
    pageSize: 20
  }

  private isUpdate = ['无更新', '有更新']

  private rules = {
    serviceName: [{ required: true, message: '服务名称必填', trigger: 'change' }],
    displayName: [{ required: true, message: '显示名称必填', trigger: 'change' }]
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getServiceList(this.listQuery)
    this.serviceList = data.serviceList
    this.total = data.total
    /*
    this.list = dirList.map((v: LiveRoom) => {
      this.$set(v, 'start', false) // https://vuejs.org/v2/guide/reactivity.html
      return v
    })
    */
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private resetTempService() {
    this.tempService = cloneDeep(defaultService)
  }

  private handleCreate() {
    this.resetTempService()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const service = {
          serviceName: this.tempService.serviceName,
          displayName: this.tempService.displayName,
          status: this.tempService.status
        }
        await addService({ ...service })
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.getList()
        }, 1 * 1000)
      }
    })
  }

  private handleUpdate(row: Service) {
    this.tempService = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private async updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const service = {
          id: this.tempService.id,
          serviceName: this.tempService.serviceName,
          displayName: this.tempService.displayName,
          status: this.tempService.status
        }
        await editService({ ...service })
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.getList()
        }, 1 * 1000)
      }
    })
  }

  private deleteConfirm(service: Service) {
    this.$confirm('删除服务会同时删除服务所拥有的权限，确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteService(service)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteService(service: Service) {
    const servicePost = {
      id: service.id
    }
    await deleteService(servicePost)
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getList()
    }, 0.5 * 1000)
  }
}
</script>
