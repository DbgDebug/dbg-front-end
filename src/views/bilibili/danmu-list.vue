<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="date"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        :default-time="['00:00:00', '23:59:59']"
        style="line-height: 28px;"
        class="filter-item"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.roomid"
        placeholder="up"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in defaultUplist"
          :key="item.roomid"
          :label="item.up"
          :value="item.roomid"
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
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-search"
        @click="getCacheDanmu"
      >
        获取缓存弹幕
      </el-button>
    </div>
    <el-table
      :data="danmuList"
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
        width="120px"
        label="RoomID"
      >
        <template v-slot="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="220px"
        label="昵称"
      >
        <template v-slot="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="弹幕"
      >
        <template v-slot="scope">
          <span>{{ scope.row.danmu }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="220px"
        label="发送时间"
      >
        <template v-slot="scope">
          <span>{{ scope.row.sendTime | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getDanmus"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUpList, getDanmuList, getCacheDanmuList, defaultUp } from '@/api/bilibili'
import { Danmu, Up } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'DanmuList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private danmuList: Danmu[] = []
  private total = 0
  private defaultUplist: Up[] = [defaultUp]
  private upList: Up[] = []
  private date: number[] = [new Date(new Date().toLocaleDateString()).getTime(),
    new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1]

  private listQuery = {
    page: 1,
    pageSize: 20,
    roomid: -1,
    startTime: (this.date[0] / 1000).toFixed(),
    endTime: (this.date[1] / 1000).toFixed()
  }

  created() {
    this.getUps()
    this.getDanmus()
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  }

  private async getUps() {
    const { data } = await getUpList()
    this.upList = data
    this.defaultUplist.push(...this.upList)
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getDanmus()
  }

  private async getDanmus() {
    if (this.date == null) {
      this.date = [new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1]
    }
    this.listQuery.startTime = (this.date[0] / 1000).toFixed()
    this.listQuery.endTime = (this.date[1] / 1000).toFixed()
    if (this.listQuery.startTime > this.listQuery.endTime) {
      const time = this.listQuery.startTime
      this.listQuery.startTime = this.listQuery.endTime
      this.listQuery.endTime = time
    }
    const { data } = await getDanmuList(this.listQuery)
    this.danmuList = data.danmuList
    this.total = data.total
  }

  private async getCacheDanmu() {
    const { data } = await getCacheDanmuList()
    this.danmuList = data.danmuList
    this.total = data.total
  }

  private beforeunloadHandler(e: BeforeUnloadEvent) {
    console.info(e)
  }
}
</script>
