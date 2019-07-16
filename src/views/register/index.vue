<template>
  <div class="register-container">
    <div class="bg">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">
        <el-form-item prop="email">
          <span class="svg-container">
            <i class="el-icon-message"></i>
          </span>
          <el-input v-model="registerForm.email" name="email" @keyup.enter.native="register" type="text" auto-complete="on" placeholder="邮箱" />
        </el-form-item>
        <el-form-item prop="mobile">
          <span class="svg-container">
            <i class="el-icon-phone"></i>
          </span>
          <el-input v-model="registerForm.mobile"  name="mobile" @keyup.enter.native="register" type="tel" auto-complete="on" placeholder="电话" />
        </el-form-item>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="registerForm.username" name="username" @keyup.enter.native="register" type="text" auto-complete="on" placeholder="姓名" />
        </el-form-item>
        <el-form-item prop="dept">
          <span class="svg-container">
            <i class="el-icon-plus"></i>
          </span>
          <el-select v-model="registerForm.deptId" placeholder="请选择部门">
            <el-option v-for="(value,index) in deptList" :key="index" :label="value.name" :value="value.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            @keyup.enter.native="register"
            v-model="registerForm.password"
            name="password"
            auto-complete="on"
            placeholder="输入密码"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item prop="surePsd">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            @keyup.enter.native="register"
            v-model="registerForm.surePsd"
            name="password"
            auto-complete="on"
            placeholder="确认密码" />
        </el-form-item>
        <div class="vcode-wrapper">
          <div class="vcode">
            <el-form-item prop="vcode">
              <span class="svg-container">
                <svg-icon icon-class="example" />
              </span>
              <el-input v-model="registerForm.vcode" @keyup.enter.native="register"  name="vcode" type="text" auto-complete="on" />
            </el-form-item>
          </div>
          <img @click="changeCode" :src="vcodeImg" alt="" width="110" height="40" style="margin-top:5px;" />>
        </div>
        <el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;" @click="register()">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" style="width:100%;" @click="pop()">
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { toRegister } from "@/api/login";

export default {
  name: "register",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    const validateSurePsd = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    const validatemobile = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(value)) {
        callback(new Error("手机号码无效"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        email: "",
        mobile: "",
        username: "",
        deptId: "",
        password: "",
        surePsd: "",
        vcode: ""
      },
      registerRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatemobile }
        ],
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        vcode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        surePsd: [
          { required: true, trigger: "blur", validator: validateSurePsd }
        ],
        deptId: [{ required: true, message: "请选择部门", trigger: "blur" }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      deptList: [{ name: "江铃新能源", id: "0" }, { name: "江铃控股", id: "1" }]
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    vcodeImg() {
      return process.env.BASE_API + "/home/getJPGCode?t=" + this.index;
    }
  },
  methods: {
    pop() {
      this.$router.go(-1);
    },
    changeCode() {
      this.index++;
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    register() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          toRegister(this.registerForm)
            .then(res => {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 5 * 1000
              });
              this.$router.go(-1);
            })
            .catch(error => {
              this.registerForm.password = "";
              this.registerForm.surePsd = "";
              this.registerForm.vcode = "";
              this.changeCode();
            });
        }else{
          console.log('enter error')
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.register-container {
  background: url(../../assets/loginBg.jpg) no-repeat center;
  background-size: cover;
  .bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .register {
    width: 100%;
  }
  .vcode-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: top;
    .vcode {
      width: 70%;
    }
  }
  .el-input {
    display: inline-block;
    height: 47px;
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
  .el-form-item__content {
    display: flex;
    .el-select {
      flex: 1;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.register-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  display: flex;
  justify-content: center;
  align-items: center;
  .register-form {
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .svg-icon {
    color: #eee;
  }
}
</style>
