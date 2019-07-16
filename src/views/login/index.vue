<template>
  <div class="login-container">
    <div class="bg">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <h3 class="title">新能源汽车</h3>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <div class="vcode-wrapper">
          <div class="vcode">
            <el-form-item prop="vcode">
              <span class="svg-container">
                <svg-icon icon-class="example" />
              </span>
              <el-input @keyup.enter.native="handleLogin" v-model="loginForm.vcode" name="vcode" type="text" auto-complete="on" />
            </el-form-item>
          </div>
          <div @click="changeCode" class="code-img" :style="{'background-image':'url()'}">
            <img :src="'/home/getJPGCode?t='+index" alt="" width="110" height="40" />
          </div>
        </div>
        <el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="register">
          <el-button class="thirdparty-button" type="primary" @click.native.prevent="handleRegister">注册</el-button>
        </div>
      </el-form>
      <span class="version">v2.2.5</span>
      <!-- 粒子漂浮物 -->
    <vue-particles color="#ccc" :particleOpacity="0.7" :particlesNumber="30" shapeType="star" :particleSize="5" linesColor="#ccc" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push"></vue-particles>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { isvalidUsername } from '@/utils/validate'
import VueParticles from "vue-particles";
Vue.use(VueParticles);

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        vcode:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur',  message: "请输入用户名" }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        vcode:[{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      loading: false,
      pwdType: 'password',
      index:'',
      redirect: undefined
    }
  },
  created(){
    this.changeCode();
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    changeCode(){
      this.index = (new Date()).getTime()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.changeCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister(){
      this.$router.push({path:'/register'});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  background: url(../../assets/loginBg.jpg) no-repeat center;
  background-size:cover;
  .bg{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    position: relative;
      #particles-js {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .register{
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .vcode-wrapper{
    display: flex;
    justify-content: space-between;
    align-items: top;
    .vcode{
      width:70%;
    }
  }
  .code-img{
    margin-top:5px;
    width: 110px;
    height: 40px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: $dark_gray;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .svg-icon{
    color: #eee;
  }
  .version{
    position: absolute;
    bottom:10px;
    right:10px;
    color:$light_gray;
  }
}
</style>
