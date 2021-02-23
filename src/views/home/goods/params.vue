<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="注意!  只允许选择三级分类!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            v-model="selected"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtn">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand"></el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtn">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand"></el-table-column>


            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
              <el-table-column label="操作">
              <!-- 操作 -->
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getCategoriesList, getCate } from "@/api/request/params";
export default {
  data() {
    return {
      //商品分类列表数据
      cateList: [],

      //级联选择器的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //选中的商品分类
      selected: [],
      // 被激活的页签名
      activeName: "many",
      //动态数据/静态数据
      manyData: [],
      onlyData: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await getCategoriesList();
      if (res.meta.status === 200) {
        this.cateList = res.data;
      }
      // console.log(this.cateList);
    },
    // 选中变化触发
    handleChange() {
      this.getParamsData();
    },
    //tab页签点击
    handleTabClick() {
      // console.log(this.activeName);
      this.getParamsData();
    },
    //获取商品分类列表数据
    async getParamsData() {
      // console.log(this.selected);
      if (this.selected.length !== 3) {
        this.$message.error("请选择三级分类");
        this.selected = [];
        return;
      }
      //获取参数列表
      const { data: res } = await getCate(this.cateId, this.activeName);
      if (res.meta.status !== 200) return this.$message.error("获取信息失败");
      console.log(this.activeName);

      console.log(res);

      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }

      console.log(res);
    }
  },
  computed: {
    isBtn() {
      if (this.selected.length !== 3) {
        this.$message.error("选择分类先");
        return true;
      }
      return false;
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selected.length === 3) {
        return this.selected[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
  margin-bottom: 15px;
  span {
    margin-right: 15px;
  }
}
.el-table {
  margin: 15px 0;
}
.el-table-column {
  display: flex;
  align-items: center;
}
</style>