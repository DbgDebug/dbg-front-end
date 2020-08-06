<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('permission.createRole') }}
      </el-button>
    </div>
    <el-table
      :data="roleList"
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
        label="角色名称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="角色等级"
      >
        <template v-slot="scope">
          <span>{{ scope.row.roleLevel }}</span>
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
        :model="tmpRole"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="角色名"
          prop="roleName"
        >
          <el-input
            v-model="tmpRole.roleName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="角色等级"
          prop="roleLevel"
        >
          <el-input
            v-model="tmpRole.roleLevel"
            type="number"
          />
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="status"
        >
          <el-select
            v-model="tmpRole.status"
            style="width: 300px"
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

        <el-form-item
          label="权限"
          prop="permissionSet"
        >
          <el-tree
            ref="tree"
            :data="permissionTreeList"
            show-checkbox
            node-key="id"
            :default-checked-keys="tmpRole.permissionSet"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog()">
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
import { Form, Tree } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Role, PermissionTree } from '@/api/types'
import { defaultRole, getRoleList, addRole, editRole, deleteRole } from '@/api/role'
import { getPermissionTree } from '@/api/permission'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'RoleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private roleList: Role[] = []
  private total = 0
  private listLoading = true

  private permissionTreeList: PermissionTree[] = []

  private tmpRole: Role = {
    id: -1,
    creatorId: -1,
    roleLevel: 10,
    roleName: '',
    createTime: 0,
    updateTime: 0,
    status: 0,
    permissionSet: []
  }

  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false;
  private textMap = {
    update: '编辑',
    create: '添加'
  }

  private statusList = [{ label: '禁用', value: 0 }, { label: '使用', value: 1 }]

  private listQuery = {
    roleName: '',
    page: 1,
    pageSize: 20
  }

  private defaultProps = {
    label: 'name',
    children: 'children'
  }

  private rules = {
    roleName: [{ required: true, message: '角色名称必填', trigger: 'change' }],
    roleLevel: [{ required: true, message: '角色等级必填', trigger: 'change' }]
  }

  created() {
    this.getList()
    this.getPermissionTreeList()
  }

  private async getList() {
    const { data } = await getRoleList(this.listQuery)
    this.roleList = data.roleList
  }

  private async getPermissionTreeList() {
    const { data } = await getPermissionTree()
    this.permissionTreeList = data
  }

  private resetTempService() {
    this.tmpRole = cloneDeep(defaultRole)
  }

  private getCheckedKeys() {
    return (this.$refs.tree as Tree).getCheckedKeys()
  }

  private setChecked(checked: number[]) {
    if (undefined !== this.$refs.tree) {
      (this.$refs.tree as Tree).setCheckedKeys(checked)
    }
  }

  private resetChecked() {
    (this.$refs.tree as Tree).setCheckedKeys([])
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
        const role = {
          roleName: this.tmpRole.roleName,
          roleLevel: this.tmpRole.roleLevel,
          status: this.tmpRole.status,
          permissionSet: this.getCheckedKeys()
        }
        await addRole({ ...role })
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

  private handleUpdate(row: Role) {
    this.tmpRole = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
    this.setChecked(this.tmpRole.permissionSet)
  }

  private async updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const roel = {
          id: this.tmpRole.id,
          roleName: this.tmpRole.roleName,
          roleLevel: this.tmpRole.roleLevel,
          status: this.tmpRole.status,
          permissionSet: this.getCheckedKeys()
        }
        await editRole({ ...roel })
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

  private closeDialog() {
    this.dialogFormVisible = false
    this.resetChecked()
  }

  private deleteConfirm(role: Role) {
    this.$confirm('确定删除该角色?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteRole(role)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteRole(role: Role) {
    const rolePost = {
      id: role.id
    }
    await deleteRole(rolePost)
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
