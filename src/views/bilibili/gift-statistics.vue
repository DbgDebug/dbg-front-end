<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        class="filter-item"
        value-format="timestamp"
        @change="handleFilter"
      />
      <el-select
        v-model="roomId"
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
      <el-select
        v-model="giftType"
        placeholder="礼物类型"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in giftTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="dataLoad"
      >
        {{ $t('tagsView.refresh') }}
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="refreshStatistics"
      >
        刷新礼物统计
      </el-button>
    </div>
    <div>
      <div
        id="lineChart"
        ref="chart"
        style="margin: auto;width: 100%;height: 800px;"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts from 'echarts'
import { Up, GiftStatistics } from '@/api/types'
import { getGiftStatistics, getUpList, refreshStatistics } from '@/api/bilibili'

@Component({
  name: 'GiftStatistics'
})
export default class extends Vue {
  private charts?: echarts.ECharts | any
  private defaultUplist: Up[] = []
  private upList: Up[] = []
  private giftStatisticsList: GiftStatistics[] = []
  private date = new Date(new Date().toLocaleDateString()).getTime()
  private roomId = 0
  private upName = ''
  private xAxisData: string[] = []
  private seriesData: number[] = []
  private dataShadow: number[] = []
  private giftType = -1;

  private giftTypes = [{ label: '全部', value: -1 }, { label: '银瓜子', value: 0 }, { label: '金瓜子', value: 1 }]

  private async refreshStatistics() {
    const refreshDate = {
      date: this.date / 1000
    }
    await refreshStatistics(refreshDate)
    this.$message({
      type: 'success',
      message: '刷新成功'
    })
  }

  private async handleFilter() {
    await this.getGiftStatistics()
    this.fullData()
  }

  mounted() {
    this.init()
  }

  private zoomSize = 6;
  private async init() {
    await this.getUps()
    await this.getGiftStatistics()
    this.charts = echarts.init(document.getElementById('lineChart') as HTMLDivElement, 'light')
    this.charts.on('click', (params: any) => {
      console.log(this.xAxisData[Math.max(params.dataIndex - this.zoomSize / 2, 0)])
      this.charts.dispatchAction({
        type: 'dataZoom',
        startValue: this.xAxisData[Math.max(params.dataIndex - this.zoomSize / 2, 0)],
        endValue: this.xAxisData[Math.min(params.dataIndex + this.zoomSize / 2, this.seriesData.length - 1)]
      })
    })
    this.fullData()
  }

  private async getUps() {
    const { data } = await getUpList()
    this.upList = data
    this.defaultUplist.push(...this.upList)
    this.roomId = this.upList[0].roomid
  }

  private async getGiftStatistics() {
    const { data } = await getGiftStatistics(this.roomId, this.date / 1000, this.giftType)
    this.giftStatisticsList = data
  }

  private async dataLoad() {
    await this.getGiftStatistics()
    this.fullData()
  }

  private fullData() {
    this.xAxisData.splice(0, this.xAxisData.length)
    this.seriesData.splice(0, this.seriesData.length)
    for (let i = 0; i < this.giftStatisticsList.length; i++) {
      const item = this.giftStatisticsList[i]
      this.xAxisData[i] = item.giftName + '(' + item.price + ')'
      this.seriesData[i] = item.num
    }
    this.charts.setOption(this.option, true)
  }

  private option={
    title: {
      text: '礼物统计',
      left: '50%',
      textAlign: 'center'
    },
    tooltip: {},
    grid: { containLabel: true },
    xAxis: {
      data: this.xAxisData,
      axisLabel: {
        inside: false,
        interval: 0,
        rotate: 40,
        textStyle: {
          color: '#000'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        inside: false,
        textStyle: {
          color: '#999'
        }
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      { // For shadow
        type: 'bar',
        itemStyle: {
          color: 'rgba(0,0,0,0.05)'
        },
        barGap: '-100%',
        barCategoryGap: '40%',
        data: this.dataShadow,
        animation: false,
        label: {
          normal: {
            position: 'top',
            show: true
          }
        }
      },
      {
        label: {
          normal: {
            position: 'top',
            show: true
          }
        },
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ]
          )
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ]
            )
          }
        },
        data: this.seriesData
      }]
  }
}
</script>
