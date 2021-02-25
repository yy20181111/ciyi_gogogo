<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-col :span="7">
        <!-- 输入框 -->
        <el-input placeholder="请输入内容" v-model="input2" :disabled="true" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <!-- 表格 -->
      <el-table stripe :data="orderList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="订单编号" width="500" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" >
          <template slot-scope="scope">
             ￥ {{scope.row.order_price}} 
          </template>
        </el-table-column>
        <!-- <el-table-column label="地址" prop="consignee_addr"></el-table-column> -->
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status == '0'">未付款</el-tag>
            <el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="update_time" :formatter="formatDate"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="success" size="mini" icon="el-icon-circle-plus" @click="showEditDialog(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改的dialog -->
      <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" ref="editFormRef">
        <el-form label-width="70px">
          <el-form-item label="修改地址">
            <el-input v-model="input3"  :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible=false">取 消</el-button>
          <el-button @click="editDialogVisible=false" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { handleOrdersList } from "../../../api/request/orders";
import { formatTime } from '@/utils/format'
export default {
  data() {
    return {
      orderList: [],
      //分页
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 15
      },
      total: null,
      input2: "这个不允许输入哦!!   我没做",
      //修改后的地址
      addressRe: {
        roleName: "",
        
      },

      input3:'当前id不允许修改',
      editDialogVisible: false
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { query, pagenum, pagesize } = this.queryInfo;
      const { data: res } = await handleOrdersList(query, pagenum, pagesize);
      console.log(res);
      if (res.meta.status === 200) {
        this.total = res.data.total;
        this.orderList = res.data.goods;
      }
    },
    // 格式化时间戳
    formatDate(row) {
     return formatTime(row.update_time)
      // let date = new Date(parseInt(row.update_time) * 1000);
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

    // 分页(pagesize改变)
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    // 分页2(页码改变)
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    //修改的dialog
    showEditDialog(id) {
      this.editDialogVisible = true;
console.log(id);





    }
  }
};
</script>

<style lang="less" scoped>
.el-col {
  margin-bottom: 15px;
}
</style>