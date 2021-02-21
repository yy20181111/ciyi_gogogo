<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addClassdialogVisible  = true">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList" max-height='500'
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen;font-size:18px"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="rank" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialogVisible(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteClass(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 添加分类dialog -->
      <el-dialog title="添加分类" :visible.sync="addClassdialogVisible">
        <el-form label-width="70px" :model="addClass">
          <el-form-item label="分类名称">
            <el-input v-model="addClass.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              expand-trigger="hover"
              :options="parentList"
              :props="props"
              v-model="cheakedList"
              @change="parentChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getAddClass">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑的dialog -->
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="30%">
        <el-form label-width="70px" :model="editClass">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editClass.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="editClassInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  handleCategories,
  handleParentCategories,
  handleAddCategories,
  delClass,
  handleClassInfo,
  editClass
} from "../../../api/request/categories";
export default {
  data() {
    return {
      //分页条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      //table列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "500"
        },
        {
          label: "是否有效",
          type: "template", //当前列定义为模板列
          template: "isok", //当前列模板名称
          align: "center",
          headerAlign: "center"
        },
        {
          label: "排序",
          type: "template", //当前列定义为模板列
          template: "rank", //当前列模板名称
          align: "center",
          headerAlign: "center"
        },
        {
          label: "操作",
          type: "template", //当前列定义为模板列
          template: "operate" //当前列模板名称
        }
      ],
      //总数据条数
      total: null,
      // 商品分类列表数据
      cateList: [],
      // 添加分类dialog
      addClassdialogVisible: false,
      //添加分类数据
      addClass: {
        cat_name: "",
        cat_pid: "",
        cat_level: ""
      },
      //父级列表数据
      parentList: [],
      //级联选择器的配置对象
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 已选择的分类
      cheakedList: [],
      //编辑dialog
      editDialogVisible: false,

      //  修改后的分类信息
      editClass: {
        cat_id: "",
        cat_name: ""
      }
    };
  },
  created() {
    // 获取商品分类列表数据
    this.getCategories();
    this.getParentCategories();
  },
  methods: {
    // 获取商品分类列表数据
    async getCategories() {
      const { type, pagenum, pagesize } = this.queryInfo;

      const { data: res } = await handleCategories(type, pagenum, pagesize);

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
      // console.log(this.cateList);
      // console.log(  this.total);
    },
    // 分页(pagesize改变)
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategories();
    },
    // 分页2(页码改变)
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategories();
    },
    //获取父级分类列表数据
    async getParentCategories() {
      const { data: res } = await handleParentCategories(2);
      if (res.meta.status !== 200)
        return this.$message.error("获取父级列表失败");
      this.parentList = res.data;
      // console.log(this.parentList);
    },

    //父级分类的id
    parentChanged() {
      // console.log(this.cheakedList);
      if (this.cheakedList.length > 0) {
        this.addClass.cat_pid = this.cheakedList[this.cheakedList.length - 1];
        this.addClass.cat_level = this.cheakedList.length; //父等级
        return;
      } else {
        this.addClass.cat_pid = 0;
        this.addClass.cat_level = 0;
      }
    },
    //点击添加分类
    async getAddClass() {
      this.parentChanged();
      const { data: res } = await handleAddCategories(this.addClass);
      if (res.meta.status !== 201) {
        this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.addClassdialogVisible = false;
      // this.getCategories();
      this.getParentCategories();
    },

    //删除
    async deleteClass(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(res);

      //确认返回confirm  取消返回cancel
      if (res !== "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res1 } = await delClass(id);

      this.$message.success(res1.meta.msg);
      console.log(res1);

      this.getCategories();
    },

    //点击展开修改dialog,获取id
    async showEditDialogVisible(id) {
      this.editDialogVisible = true;
      console.log(id);
      const { data: res } = await handleClassInfo(id);
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.$notify.success("已查询到该分类");
      this.editClass = res.data;
      console.log(res.data.cat_name);
    },
    //修改分类信息
    async editClassInfo() {
      const { data: res } = await editClass(this.editClass.cat_id, {
        cat_name: this.editClass.cat_name
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.getCategories();
      this.editDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>