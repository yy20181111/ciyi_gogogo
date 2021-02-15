<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 导航菜单 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 输入框 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="DialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="DialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户dialog -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form label-width="70px" :model="editForm" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="noEdit">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  handleUserList,
  handleAddUser,
  handleUserInfo,
  handleReUserInfo,
  deleteUserInfo
} from "../../../api/request/users";
export default {
  data() {
    //校验邮箱规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/;

      if (regEmail.test(value)) {
        //合法邮箱
        console.log(value);
        return cb();
      }
      cb(new Error("输入合法邮箱"));
    };

    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      userList: [],
      total: 0,
      // 添加dialog默认关闭
      DialogVisible: false,
      // 修改对话框
      editDialogVisible: false,
      //修改信息保存
      editForm: {
        email: "",
        mobile: ""
      },
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur", message: "请输入合法邮箱" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" }
        ]
      },
      //编辑用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入修改后的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur", message: "请输入合法邮箱" }
        ],
        mobile: [
          { required: true, message: "请输入更改后的手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { query, pagenum, pagesize } = this.queryInfo;
      const { data: res } = await handleUserList(query, pagenum, pagesize);
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
      // console.log(this.userList);
      // console.log(this.total);
    },
    // 分页(pagesize改变)
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 分页2(页码改变)
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //添加用户
    async addUser() {
      const { data: res } = await handleAddUser(this.addForm);
      console.log(res);
      this.DialogVisible = false;
      this.getUserList();
    },
    //展示编辑用户对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      // console.log(id);
      const { data: res } = await handleUserInfo(id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.Error("查询失败");
      }
      this.$notify.success("已查询到该用户");
      this.editForm = res.data;
    },
    //监听对话框关闭重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 确定修改
    editUserInfo() {
     this.editDialogVisible = false,
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return this.$message.Error("不对!");
          //发起请求修改
          const { data: res } = await handleReUserInfo( this.editForm.id, {email:this.editForm.email,mobile:this.editForm.mobile}
          );
          this.getUserList()
          this.$message.success('修改成功')
          console.log(this.editForm.id);
          console.log(res);
        });
    },
    //取消修改
  noEdit(){
     this.editDialogVisible = false,
this.$message.warning('已取消修改')

  },
    //删除用户
    async deleteUser(id) {
      // console.log(id);

      //弹框询问确定是否删除
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //确认返回confirm  取消返回cancel
      if (res !== "confirm") {
        return this.$message.info("已取消");
      }
      // console.log("已删除");
      const { data: res1 } = await deleteUserInfo(id);
      // console.log(res1);
      this.$message.success(res1.meta.msg);
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>