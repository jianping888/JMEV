<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
      <el-form-item label="用户名">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.username" placeholder="请输入用户" suffix-icon="el-icon-edit"/>
      </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button type="primary" size="small" v-show="isRole('/user/listdata')" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button type="primary" size="small" v-show="isRole('/user/save')" @click="edit('新增')">新增</el-button>
        </el-button-group>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      size="mini"
      fit
      stripe
      max-height="652"
      highlight-current-row
      style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="用户名"  align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="所在部门" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.depName }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="邮箱" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="手机" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.statusString }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="注册时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/user/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/user/delete')" class="item" effect="dark" content="删除" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline"  @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" @close="cancel" top="50px" width="506px" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" size="small" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" :disabled="userNameKey" v-model="addFormQuery.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addFormQuery.password" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input type="email" v-model="addFormQuery.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input type="tel" v-model="addFormQuery.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="addFormQuery.deptId" placeholder="请选择">
            <el-option label="无" :value="0"></el-option>
            <el-option label="江铃新能源" :value="1"></el-option>
            <el-option label="江铃新能源开发" :value="2"></el-option>
            <el-option label="江铃新能源测试" :value="3"></el-option>
            <el-option label="江铃新能源用户" :value="4"></el-option>
            <el-option label="江铃新能源经销商" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-checkbox-group v-model="addFormQuery.roleIds" size="small">
            <el-checkbox v-for="(item,index) in rolesList" :key="index" :label="item.roleId" border>{{item.remark}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addFormQuery.status" placeholder="请选择">
            <el-option label="正常使用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="只查看车组警告" label-width="120px">
          <el-select v-model="addFormQuery.onlyGroupWarn" placeholder="请选择">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改结束 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      prev-text="上一页"
      next-text="下一页"
      :current-page="listQuery.pageIndex"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getInfo } from "@/api/login";
import { role } from "@/utils";
import {
  getUserListdata,
  addUser,
  editUser,
  deleteUser
} from "@/api/management";

export default {
  name: 'user',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
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
      userNameKey: false,
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        deptId: "",
        roleIds: [],
        status: "",
        onlyGroupWarn: false
      },
      addRules: {
        username: {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatemobile }
        ],
        roleIds: {
          required: true,
          message: "请选择角色",
          trigger: "blur"
        },
        status: {
          required: true,
          message: "请选择状态",
          trigger: "blur"
        }
      },
      listQuery: {
        username: "",
        deptId: "",
        pageIndex: 1,
        pageSize: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["rolesList"])
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.userNameKey = true;
        this.addRules.password = [];
        getInfo(data.userId).then(res => {
          const resData = JSON.parse(JSON.stringify(res.user));
          this.addFormQuery = {
            userId: resData.userId,
            username: resData.username,
            password: "",
            email: resData.email,
            mobile: resData.mobile,
            deptId: resData.deptId,
            roleIds: [],
            status: resData.status,
            onlyGroupWarn: resData.onlyGroupWarn
          };
          res.roleset.forEach(value => {
            this.addFormQuery.roleIds.push(value.roleId);
          });
        });
      }
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser({ id: data.userId }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getListData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    makeSure(formName) {
      let array = [];
      this.addFormQuery.roleIds.forEach(value => {
        array += value + ",";
      });
      this.addFormQuery.roleIds = array;
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addUser(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editUser(this.addFormQuery).then(res => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
        this.cancel();
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.userNameKey = false;
      this.addRules.password = [
        { required: true, trigger: "blur", validator: this.validatePass }
      ];
      this.addFormQuery = {
        username: "",
        password: "",
        email: "",
        mobile: "",
        deptId: "",
        roleIds: [],
        status: "",
        onlyGroupWarn: false
      };
    },
    clear() {
      this.listQuery = {
        username: "",
        deptId: "",
        pageIndex: 1,
        pageSize: 15
      };
    },
    getListData() {
      this.listLoading = true;
      getUserListdata(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.getListData();
      this.$store.dispatch("GetRoleList", {
        name: "",
        page: 1,
        rows: 15
      });
    },
    /**分页方法开始**/

    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.fetchData();
    },
    prevClick() {
      this.listQuery.pageIndex--;
      this.fetchData();
    },
    nextClick() {
      this.listQuery.pageIndex++;
      this.fetchData();
    }
    /**分页方法结束**/
  }
};
</script>
<style scoped>
.select-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.inner-wrapper {
  display: flex;
}
</style>
