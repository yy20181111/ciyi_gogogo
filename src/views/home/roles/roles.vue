<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="addDialog = true">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="rolesData" border style="width: 100%" stripe :model="rolesData">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="bdbottom" v-for=" item1 in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row.id,item1.id )">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row class="second-role" v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row.id,item2.id )"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children "
                      :key="item3.id"
                      @close="removeRight(scope.row.id,item3.id )"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="address" label="操作">
          <!-- 操作按钮 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini " @click="deleteRole(scope.row.id)" >删除</el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click=" setRightDialog(scope.$index, scope.row.id)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色dialog -->
    <el-dialog title="添加角色" :visible.sync="addDialog" width="30%" @close="addDialogClosed">
      <el-form label-width="80px" ref="addFormRef" :model="addNewData">
        <el-form-item label="角色名称">
          <el-input v-model="addNewData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addNewData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的dialog -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" ref="editFormRef">
      <el-form label-width="70px" :model="editRoles">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible">
      <el-tree :data="rightsTrees" :props="rightsTreesProps" show-checkbox node-key="id" :default-checked-keys="checkdTreesId"  :default-expand-all="true" 
       @check-change="changeNode"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reSetRightDialog">取 消</el-button>
        <el-button type="primary" @click="confirmSetRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  addRoles,
  delRoles,
  handleRolesInfo,
  editRoles,
  deleteRolesRight,
  getRightsTree,
  setRight
} from "@/api/request/rights";
export default {
  data() {
    return {
      //角色数据
      rolesData: [],
      //新增数据
      addRoleList: {
        roleName: "",
        roleDesc: ""
      },
      //修改后的角色
      editRoles: {
        roleName: "",
        roleDesc: ""
      },
      //弹框开关
      addDialog: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      addNewData: {
        roleName: "",
        roleDesc: ""
      },
      rids: "",
      //所有权限数据
      rightsTrees: [],
      rightsTreesProps: {
        label: "authName",
        children: "children"
      },
      //默认选中权限id
      checkdTreesId: [],
      tempArr: [], // 临时保存递归权限的id
      roleId: null,
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //请求角色列表数据
    async getRoles() {
      const { roleName, roleDesc } = this.rolesData;
      const { data: res } = await getRolesList(roleName, roleDesc);
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.rolesData = res.data;
      // console.log(this.rolesData);

      // console.log(res);
    },
    //添加角色
    async addRole() {
      const { data: res } = await addRoles(this.addNewData);
      console.log(res);
      this.getRoles();
      this.addDialog = false;
      this.$message.success("已成功添加");
    },
    //删除角色
    async deleteRole(id) {
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(result);

      if (result !== "confirm") {
        return this.$message.info("已取消");
      }

      const { data: res } = await delRoles(id);
      this.$message.success("已删除");
      console.log(res);
      this.getRoles();
    },
    //监听对话框关闭重置
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //根据id查询到该角色
    async showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      const { data: res } = await handleRolesInfo(id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      } 
      this.$notify.success("已查询到该角色");
      this.editRoles = res.data;
      console.log(res.data.roleId);
    },
    //修改角色
    async editRole() {
      this.editDialogVisible = false;
      //发起请求修改
      const { data: res } = await editRoles(this.editRoles.roleId, {
        roleName: this.editRoles.roleName,
        roleDesc: this.editRoles.roleDesc
      });
      this.getRoles();
      this.$message.success("修改成功");
      console.log(this.editRoles.roleId);
      console.log(res);
    },
    //根据id删除对应角色
    async removeRight(roleId, rightId) {
      const res = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (res !== "confirm") return this.$notify.error("已取消");
      let result = await deleteRolesRight(roleId, rightId);
      if(result) {
        this.$notify.success("已删除");
      }
      this.getRoles();
      
    },
    //获取dialog权限列表
    setRightDialog(index, id) {
      this.roleId = id
      this.getAllRole(index)
    },
    // 获取所有的权限 渲染树形
    async getAllRole (index){
      const { data: res } = await getRightsTree();
      this.rightsTrees = res.data;
      console.log( this.rightsTrees)
      // 默认选中
      this.checkdTreesId = this.getRoleId(this.rolesData[index].children)
      this.setRightDialogVisible = true;
    },
    //递归获取角色下的所有权限id   出口   入口 
    getRoleId (roles){ 
      roles.forEach(item => {
        if(!item.children) {
          this.tempArr.push(item.id)
        } else {
          this.getRoleId(item.children)
        }
      })
      return this.tempArr
    },

    // 选中树形的回调
    changeNode (node){
     this.checkdTreesId.push(node.id)

    },
    // 确认分配权限
    async confirmSetRight (){
      let ids = this.checkdTreesId.join(",")
      console.log(this.checkdTreesId)
      let res = await setRight(this.roleId,{rids: ids})
      console.log(res)
      if(res.data.meta.status === 200 ) {
        this.$notify.success("分配成功");
        this.setRightDialogVisible = false
        this.getRoles();
      }
    },
    //点击取消重置dialog
    reSetRightDialog(){
           this.setRightDialogVisible = false
this.getAllRole()
    }
  }
};
</script>


<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
// /deep/ .el-table__expanded-cell {
//   padding: 15px 15px;
// }
// /deep/ .el-table__expanded-cell{
//   padding:15px 50px;
// }
.el-tag {
  margin: 20px 20px 20px 20px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bd {
  border-bottom: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  &:first-of-type {
    border-top: 1px solid #eee;
  }
}
.second-role {
  border-bottom: 1px solid #eee;
  &:last-of-type {
    border: none;
  }
}
.el-row {
  margin-bottom: 0;
}
</style>