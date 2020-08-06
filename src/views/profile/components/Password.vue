<template>
  <el-form
    ref="passwordForm"
    :model="passwordForm"
    :rules="passwordRules"
  >
    <el-form-item
      label="旧密码"
      prop="passwordOld"
    >
      <el-input
        v-model="passwordForm.passwordOld"
        :type="passwordType"
      />
    </el-form-item>
    <el-form-item
      label="新密码"
      prop="passwordNew"
    >
      <el-input
        v-model="passwordForm.passwordNew"
        :type="passwordType"
        name="password"
      />
    </el-form-item>
    <el-form-item
      label="确认新密码"
      prop="passwordTmp"
    >
      <el-input
        v-model="passwordForm.passwordTmp"
        :type="passwordType"
        name="passwordTmp"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submit"
      >
        更新
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { Account } from '@/api/types'
import { defaultAccount, updatePassword } from '@/api/account'
import { isPassword } from '@/utils/validate'

@Component({
  name: 'Password'
})
export default class extends Vue {
  private account: Account = defaultAccount
  private passwordTmp = ''
  private passwordType = 'password'

  private passwordForm = {
    passwordOld: '',
    passwordNew: '',
    passwordTmp: ''
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    console.info('passwordNew:' + value)
    if (isPassword(value)) {
      callback()
    } else {
      callback(new Error('密码长度在6~18之间，只能包含字母、数字和下划线'))
    }
  }

  private passwordCheck = (rule: any, value: string, callback: Function) => {
    console.info('passwordTmp:' + value)
    if (value !== this.passwordForm.passwordNew) {
      callback(new Error('密码不一致'))
    } else {
      callback()
    }
  }

  private passwordRules = {
    passwordOld: [{ validator: this.validatePassword, trigger: 'blur' }],
    passwordNew: [{ validator: this.validatePassword, trigger: 'blur' }],
    passwordTmp: [{ validator: this.passwordCheck, trigger: 'blur' }]
  }

  private submit() {
    (this.$refs.passwordForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.updatePassword()
      }
    })
  }

  private async updatePassword() {
    const { data } = await updatePassword({ passwordOld: this.passwordForm.passwordOld, passwordNew: this.passwordForm.passwordNew })
    if (data === true) {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    } else {
      this.$message({
        message: 'User information has been updated failed',
        type: 'error',
        duration: 5 * 1000
      })
    }
  }
}
</script>
