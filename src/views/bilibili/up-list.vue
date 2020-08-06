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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="getList"
      >
        {{ $t('tagsView.refresh') }}
      </el-button>
    </div>
    <el-table
      :data="list"
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
        label="RoomID"
      >
        <template v-slot="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="UP"
      >
        <template v-slot="scope">
          <span>{{ scope.row.up }}</span>
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
        label="连接状态"
      >
        <template v-slot="scope">
          <span>{{ status[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="300"
      >
        <template v-slot="{row}">
          <el-button
            v-if="row.status === 0"
            type="primary"
            size="mini"
            @click="start(row)"
          >
            开始
          </el-button>
          <el-button
            v-else
            type="danger"
            size="mini"
            @click="stop(row)"
          >
            停止
          </el-button>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempLiveRoom"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="up"
          prop="up"
        >
          <el-input
            v-model="tempLiveRoom.up"
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="房间编号"
          prop="roomid"
        >
          <el-input
            v-model="tempLiveRoom.roomid"
            type="number"
          />
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
  addRoom, editRoom, deleteRoom, start,
  stop, getRoomList, defaultLiveRoom
} from '@/api/bilibili'
import { LiveRoom } from '@/api/types'

@Component({
  name: 'UpList'
})
export default class extends Vue {
  private list: LiveRoom[] = []
  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false;
  private textMap = {
    update: '编辑直播间',
    create: '添加直播间'
  }

  private status = ['未连接', '已连接']

  private tempLiveRoom = defaultLiveRoom
  private rules = {
    up: [{ required: true, message: 'up必填', trigger: 'change' }],
    roomid: [{ required: true, message: '房间号必填', trigger: 'change' }]
  }

  created() {
    this.getList()
  }

  private async getList() {
    const { data } = await getRoomList({})
    this.list = data
    /*
    this.list = dirList.map((v: LiveRoom) => {
      this.$set(v, 'start', false) // https://vuejs.org/v2/guide/reactivity.html
      return v
    })
    */
  }

  private async start(row: LiveRoom) {
    const room = {
      id: row.id
    }
    await start(room)
    this.$message({
      message: '连接成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getList()
    }, 0.5 * 1000)
  }

  private async stop(row: LiveRoom) {
    const room = {
      id: row.id
    }
    await stop(room)
    this.$message({
      message: '连接已断开',
      type: 'success'
    })
    setTimeout(() => {
      this.getList()
    }, 0.5 * 1000)
  }

  private resetTempLiveRoom() {
    this.tempLiveRoom = defaultLiveRoom
  }

  private handleCreate() {
    this.resetTempLiveRoom()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const liveRoom = {
          up: this.tempLiveRoom.up,
          roomid: this.tempLiveRoom.roomid
        }
        await addRoom({ ...liveRoom })
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.getList()
        }, 1 * 1000)
      }
    })
  }

  private handleUpdate(row: LiveRoom) {
    this.tempLiveRoom = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private async updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const liveRoom = {
          id: this.tempLiveRoom.id,
          up: this.tempLiveRoom.up,
          roomid: this.tempLiveRoom.roomid
        }
        await editRoom({ ...liveRoom })
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
    this.$message({
      message: '操作成功',
      type: 'success'
    })
  }

  private deleteConfirm(liveRoom: LiveRoom) {
    this.$confirm('确定删除此房间?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteLiveRoom(liveRoom)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async deleteLiveRoom(liveRoom: LiveRoom) {
    await deleteRoom(liveRoom)
    this.$message({
      message: '操作成功',
      type: 'success'
    })
    setTimeout(() => {
      this.getList()
    }, 0.5 * 1000)
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
