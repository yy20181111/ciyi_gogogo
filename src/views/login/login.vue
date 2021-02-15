<template>
  <div class="loginContainer">
    <div class="loginBox">
      <!-- 头像 -->
      <div class="userImg">
        <img src="../../assets/images/ciyi.jpg" alt />
      </div>
      <!-- 表单 -->
      <el-form ref="loginFormRef" class="loginForm" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghuming" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="validateloginForm">登录</el-button>
          <el-button type="primary" @click="resetloginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { handlelogin } from "../../api/request/login";
import { setToken } from "../../utils/cookie/index";
export default {
  data() {
    return {
      loginForm: {
        //登录数据绑定
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      loginRules: {
        username: [
          { required: true, message: "3-5个字", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "3-8个字", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //表单重置
    resetloginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //登录预验证是否发起请求
    validateloginForm() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await handlelogin(this.loginForm);
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$notify.error("登录失败,请重新输入");
        this.$notify.success("成功登陆");
        //保存token
        setToken(res.data.token);
        this.$router.push('/home')
      });
    }
  }
};
</script>

<style lang='less' scoped>
.loginContainer {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #868bc1;
  .loginBox {
    width: 400px;
    height: 300px;
    background-color: #eee;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .userImg {
      width: 150px;
      height: 150px;
      background-color: #eee;
      padding: 10px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -25%;
      transform: translate(-50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .loginForm {
      position: absolute;
      bottom: 25px;
      width: 100%;
      padding: 0 50px;
    }
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
