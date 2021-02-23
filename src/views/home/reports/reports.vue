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
    </el-card>
  </div>

</template>

<script>
// import {getTimeImg} from '../../../api/request/reports'
export default {
created(){

}
}
</script>

<style lang="less" scoped>

</style>