<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限卡片区 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="rolesList" border style="width: 100%" stripe >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column  label="权限名称" prop="authName"></el-table-column>
        <el-table-column  label="路径" prop="path"></el-table-column>
        <el-table-column  label="权限等级" prop="level">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.level == "0"'>一级</el-tag>
                <el-tag type="success" v-if='scope.row.level == "1"'>二级</el-tag>
                <el-tag type="warning" v-if='scope.row.level == "2"'>三级</el-tag>
                
            </template>

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getRightsList} from '@/api/request/rights'
export default {
data(){
  return{
    //角色列表数据
    rolesList:[]
  }
},
created(){
  this.rightList()
},
methods:{
  async rightList(){
    const {data:res} = await getRightsList()
    console.log(res);
    if(res.meta.status!=200) return this.$notify.error('获取权限列表失败');
    // this.$message.success(res.meta.msg)
    this.rolesList = res.data
    
  }
}
};
</script>

<style lang="less" scoped>
</style>