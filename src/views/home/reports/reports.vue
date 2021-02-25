<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 图表区 -->
      <div style="width:700px;height:500px" ref="chart"></div>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { handleReportType } from "../../../api/request/orders";
const echarts = require("echarts");
export default {
  data() {
    return {
      //折线图数据(需合并)
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  async mounted() {
    //初始化echarts
    let myChart = echarts.init(this.$refs.chart);
    const { data: res } = await handleReportType();
    //合并后端数据和echarts
    _.merge(res.data,this.options)

    myChart.setOption(res.data);
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
</style>