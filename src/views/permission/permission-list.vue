<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.permissionName"
        placeholder="权限名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.serviceId"
        style="width: 200px;"
        class="filter-item"
        placeholder="选择服务"
        @change="handleFilter"
      >
        <el-option
          v-for="item in serviceSelect"
          :key="item.id"
          :label="item.displayName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        style="width: 200px;"
        class="filter-item"
        placeholder="权限状态"
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      v-loading="listLoading"
      :data="permissionList"
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
        label="服务"
      >
        <template v-slot="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="权限名称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.permissionName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="访问路径"
      >
        <template v-slot="scope">
          <span>{{ scope.row.path }}</span>
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
        label="状态"
        width="80"
      >
        <template v-slot="scope">
          <span>{{ statusTable[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="180"
      >
        <template v-slot="{row}">
          <el-button
            v-if="row.status === 0"
            type="success"
            size="mini"
            plain
            @click="enable(row)"
          >
            启用
          </el-button>
          <el-button
            v-if="row.status === 1"
            size="mini"
            type="danger"
            plain
            @click="discontinue(row)"
          >
            停用
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteConfirm(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getPermissionList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getServiceList, defaultPermission, getPermissionList, deletePermission,
  setPermissionStatus
} from '@/api/permission'
import { Service, Permission } from '@/api/types'
import { isPermissionPath } from '@/utils/validate'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'PermissionList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private permissionList: Permission[] = []
  private total = 0
  private serviceDialog: Service = {
    id: -1,
    serviceName: '',
    displayName: '无',
    createTime: 0,
    updateTime: 0,
    status: 0
  }

  private serviceSearch: Service = {
    id: -1,
    serviceName: '',
    displayName: '全部',
    createTime: 0,
    updateTime: 0,
    status: 0
  }

  private statusSelect = [{ value: -1, label: '全部' }, { value: 0, label: '停用' }, { value: 1, label: '使用' }]

  private serviceList: Service[] = []
  private serviceSelect: Service[] = [this.serviceSearch]
  private listLoading = true
  private tempPermission = defaultPermission

  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false;
  private textMap = {
    update: '编辑',
    create: '添加'
  }

  private statusTable = ['停用', '使用']
  private statusList = [{ label: '禁用', value: 0 }, { label: '使用', value: 1 }]

  private listQuery = {
    serviceId: undefined,
    permissionName: '',
    status: undefined,
    page: 1,
    pageSize: 20
  }

  private isUpdate = ['无更新', '有更新']

  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isPermissionPath(value)) {
      callback(new Error('Please enter the correct user name'))
    } else {
      callback()
    }
  }

  private rules = {
    serviceId: [{ required: true, message: '无服务可选', trigger: 'change' }],
    permissionName: [{ required: true, message: '权限名称必填', trigger: 'change' }],
    path: [
      { required: true, message: '访问路径必填', trigger: 'blur' },
      { validator: this.validateUsername, message: '路径格式不正确', trigger: 'blur' }
    ]
  }

  created() {
    this.getPermissionList()
    this.getServiceList()
  }

  private search() {
    this.listLoading = true
    this.getPermissionList()
  }

  private async getServiceList() {
    const serviceQuery = {
      serviceName: '',
      page: 1,
      pageSize: 200
    }
    const { data } = await getServiceList(serviceQuery)
    this.serviceList.push(...data.serviceList)
    this.serviceSelect.push(...data.serviceList)
    if (this.serviceList.length === 0) {
      this.serviceList = [this.serviceDialog]
    }
  }

  private async getPermissionList() {
    const { data } = await getPermissionList(this.listQuery)
    this.permissionList = data.permissionList
    this.total = data.total
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getPermissionList()
  }

  private enable(permission: Permission) {
    this.setPermissionStatus(permission.id, 1)
  }

  private discontinue(permission: Permission) {
    this.setPermissionStatus(permission.id, 0)
  }

  public async setPermissionStatus(id: number, status: number) {
    const data = {
      id: id,
      status: status
    }
    await setPermissionStatus(data)
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getPermissionList()
    }, 0.5 * 1000)
  }

  private deleteConfirm(permission: Permission) {
    this.$confirm('确定删除此权限?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteData(permission)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteData(permission: Permission) {
    const permissionPost = {
      id: permission.id
    }
    await deletePermission(permissionPost)
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getPermissionList()
    }, 0.5 * 1000)
  }
}
</script>
