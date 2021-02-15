<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="hLogo">
        <img src="../../assets/images/ciyi.jpg" alt />
        <span>后台管理程序</span>
      </div>
      <el-button type="info" @click="logout">点击退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '63px' : '200px'" >
        <div class="toClose" @click="close">|||</div>
        <el-menu unique-opened :collapse-transition="false"
       router
          background-color="#333743"
          text-color="#fff"
          active-text-color="#03CEF5" :collapse='isCollapse'
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/'+ subitem.path +''" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { handleMenus } from "../../api/request/login";
export default {
  data() {
    return {
      menuList: [],
      menuIcon: {
        '125': "iconfont icon-yonghuguanli",
        '103': "iconfont icon-quanxianguanli",
        '101': "iconfont icon-shangpingouwudai",
        '102': "iconfont icon-logooo_huabanfuben",
        '145': "iconfont icon-shujutongji"
      },
      isCollapse:false
      
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    // 点击返回登录页
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //请求侧边栏数据
    async getMenus() {
      const { data: res } = await handleMenus();
      // console.log(res);
      if (res.meta.status != 200) return res.meta.msg;
      this.menuList = res.data;
    },
    //点击收起
   close(){
      this.isCollapse = ! this.isCollapse
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    padding: 0;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #373a3f;
    .hLogo {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      span {
        font-size: 20px;
        margin-left: 15px;
        color: #fff;
      }
    }
    .el-button {
      margin-right: 20px;
    }
  }
  .el-aside {
    .el-menu{
      border: 0;
    }
    background-color: #333743;
    .iconfont{
      font-size: 20px;
      margin-right: 10px;
      color: #eee;
    }
    .toClose {
      color: #eee;
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaebef;
  }
}
</style>