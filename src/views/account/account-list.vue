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
      :data="accountList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        width="80px"
        align="center"
        label="ID"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="用户名"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="姓名"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="性别"
      >
        <template slot-scope="scope">
          <span>{{ sex[scope.row.sex] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="邮箱"
      >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="最后登录时间"
      >
        <template slot-scope="{row}">
          <span>{{ row.lastTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="240px"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>

          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
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
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempAccount"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="tempAccount.username"
            type="text"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus === 'create'"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="tempAccount.password"
            type="password"
          />
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="realName"
        >
          <el-input
            v-model="tempAccount.realName"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="tempAccount.email"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="性别"
          prop="sex"
        >
          <el-select
            v-model="tempAccount.sex"
            style="width: 300px;"
          >
            <el-option
              v-for="item in sexSelect"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="status"
        >
          <el-select
            v-model="tempAccount.status"
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

        <el-form-item
          label="角色"
        >
          <el-select
            v-model="tempAccount.roleIds"
            multiple
            placeholder="请选择"
            style="width: 300px;"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
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
import {
  defaultAccount, getAccountList,
  addAccount, editAccount, deleteAccount
} from '@/api/account'
import { getRoleList } from '@/api/role'
import { Account, Role } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { cloneDeep } from 'lodash'

@Component({
  name: 'AccountList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private accountList: Account[] = []
  private total = 0
  private tempAccount = defaultAccount
  private roleList: Role[] = []

  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false;
  private textMap = {
    update: '编辑',
    create: '添加'
  }

  private listQuery = {
    username: '',
    page: 1,
    pageSize: 20
  }

  private sex = ['女', '男']
  private sexSelect = [{ label: '女', value: 0 }, { label: '男', value: 1 }]
  private statusList = [{ label: '禁用', value: 0 }, { label: '使用', value: 1 }]

  private rules = {
    username: [{ required: true, message: '用户名必填', trigger: 'change' }],
    password: [{ required: true, message: '密码必填', trigger: 'change' }],
    realName: [{ required: true, message: '姓名必填', trigger: 'change' }],
    email: [{ required: true, message: '邮箱必填', trigger: 'change' }]
  }

  created() {
    this.getList()
    this.getRoleList()
  }

  private async getList() {
    const { data } = await getAccountList(this.listQuery)
    this.accountList = data.accountList
    this.total = data.total
  }

  private async getRoleList() {
    const roleQuery = {
      roleName: '',
      page: 1,
      pageSize: 200
    }
    const { data } = await getRoleList(roleQuery)
    this.roleList = data.roleList
  }

  private resetTempAccount() {
    this.tempAccount = cloneDeep(defaultAccount)
  }

  private handleCreate() {
    this.resetTempAccount()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private handleUpdate(row: Account) {
    this.tempAccount = Object.assign({}, row)
    this.tempAccount.password = ''
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private async createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const account = {
          username: this.tempAccount.username,
          password: this.tempAccount.password,
          realName: this.tempAccount.realName,
          email: this.tempAccount.email,
          sex: this.tempAccount.sex,
          status: this.tempAccount.status,
          roleIds: this.tempAccount.roleIds
        }
        await addAccount(account)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const account = {
          id: this.tempAccount.id,
          realName: this.tempAccount.realName,
          email: this.tempAccount.email,
          sex: this.tempAccount.sex,
          status: this.tempAccount.status,
          roleIds: this.tempAccount.roleIds
        }
        await editAccount(account)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }
    })
  }

  private deleteConfirm(account: Account) {
    this.$confirm('确定删除该用户?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteAccount(account)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteAccount(account: Account) {
    const dataPost = {
      id: account.id
    }
    await deleteAccount(dataPost)
    this.$notify({
      title: '成功',
      message: '删除成功',
      type: 'success',
      duration: 2000
    })
    this.getList()
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
