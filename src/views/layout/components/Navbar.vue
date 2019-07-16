<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <div class="avatar-container">
      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item"/>
      </el-tooltip>
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <span>{{name}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              <span style="display:block;" @click="dialogTableVisible=true">修改密码</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogTableVisible">
      <el-form ref="registerForm" label-width="80px" :model="registerQuery" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">
        <el-form-item label="原密码" prop="oldpassword">
            <el-input
              :type="pwdType"
              v-model="registerQuery.oldpassword"
              auto-complete="on"
              placeholder="原密码" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
            <el-input
              :type="pwdType"
              v-model="registerQuery.newpassword"
              auto-complete="on"
              placeholder="新密码"/>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
        </el-form-item>
        <el-form-item label="确认密码" prop="surePsd">
            <el-input
              :type="pwdType"
              v-model="registerQuery.surePsd"
              auto-complete="on"
              placeholder="确认密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="makeSure('registerForm')">确 定</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { updatePassword } from "@/api/user";
import Screenfull from '@/components/Screenfull'
import Cookie from "js-cookie";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"])
  },
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
      } else if (value !== this.registerQuery.newpassword) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      dialogTableVisible: false,
      pwdType: "password",
      registerQuery: {
        oldpassword: "",
        newpassword: "",
        surePsd: ""
      },
      registerRules: {
        oldpassword: [{required: true, trigger: "blur", validator: validatePass }],
        newpassword: [{required: true, trigger: "blur", validator: validatePass }],
        surePsd: [{required: true, trigger: "blur", validator: validateSurePsd }]
      }
    };
  },
  methods: {
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        updatePassword(this.registerQuery)
          .then(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.dialogTableVisible = false;
            this.registerQuery = {
              oldpassword: "",
              newpassword: "",
              surePsd: ""
            };
          })
          .catch();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.registerQuery = {
        oldpassword: "",
        newpassword: "",
        surePsd: ""
      };
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
        // this.$router.push('/login')
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$dark_gray: #889aa4;
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
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
    .screenfull {
      height: 20px;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.el-form-item__content {
  // margin-left:80px;
  // display: flex;
  // .el-select {
  //   flex: 1;
  // }
}
</style>
