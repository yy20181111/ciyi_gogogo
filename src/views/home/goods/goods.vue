<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="wbd">添加商品</el-button>
      </el-row>
      <el-table stripe :data="goodList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="商品名称" width="500" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="添加时间" prop="add_time" :formatter="formatDate"></el-table-column>
        <el-table-column label="商品状态" prop="goods_state">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_state === 0">未通过</el-tag>
            <el-tag type="success" v-if="scope.row.goods_state === 1">审核中</el-tag>
            <el-tag type="warning" v-if="scope.row.goods_state === 2">已审核</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 10, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodList } from "../../../api/request/goods";
import { formatTime } from '@/utils/format'

// import { dateFormat } from "../../../utils/format/index";
// import moment from "moment";
export default {
  data() {
    return {
      goodList: [],
      //分页条件

      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //总条数
      total: null
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { query, pagenum, pagesize } = this.queryInfo;
      const { data: res } = await getGoodList(query, pagenum, pagesize);
      console.log(res);
      if (res.meta.status === 200) {
        this.total = res.data.total;
        this.goodList = res.data.goods;
      }
    },
    // 格式化时间戳
    formatDate(row) {
      return formatTime(row.add_time)
      // let date = new Date(parseInt(row.add_time) * 1000);
      // let Y = date.getFullYear() + "-";
      // let M =
      //   date.getMonth() + 1 < 10
      //     ? "0" + (date.getMonth() + 1) + "-"
      //     : date.getMonth() + 1 + "-";
      // let D =
      //   date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      // let h =
      //   date.getHours() < 10
      //     ? "0" + date.getHours() + ":"
      //     : date.getHours() + ":";
      // let m =
      //   date.getMinutes() < 10
      //     ? "0" + date.getMinutes() + ":"
      //     : date.getMinutes() + ":";
      // let s =
      //   date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // return Y + M + D + h + m + s;
    },

    wbd() {
      alert("没做,除了这个列表  啥也没做,嘿嘿嘿");
    },
    // 分页(pagesize改变)
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 分页2(页码改变)
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
  }

  // filters: {
  //   filterTime(time) {
  //     return formatDate(time);
  //   }
  // }
};
</script>

<style lang="less" scoped>
</style>