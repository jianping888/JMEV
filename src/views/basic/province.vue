<template>
  <div class="app-container">
    <el-form size="small"  ref="form" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
        <el-form-item label="省份名称">
          <el-input  @keyup.enter.native="getListData" v-model="listQuery.provincename" placeholder="请输入" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select v-model="listQuery.isuse" placeholder="请选择">
            <el-option label="请选择" :value="-1"/>
            <el-option label="是" :value="1"/>
            <el-option label="否" :value="0"/>
          </el-select>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button v-show="isRole('/province/queryProvince')" type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button v-show="isRole('/province/saveProvince')" type="primary" size="small" @click="edit('新增')">新增</el-button>
        </el-button-group>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="mini"
      stripe
      highlight-current-row
      max-height="652"
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="省份名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.provincename }}
        </template>
      </el-table-column>
      <el-table-column label="是否有效"  align="center">
        <template slot-scope="scope">
          {{ isUse(scope.row.isuse) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/province/updateProvince')" class="item" effect="dark" content="修改" placement="left">
              <el-button size="mini" circle type="primary" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/province/deleteProvince')" class="item" effect="dark" content="删除" placement="right">
              <el-button size="mini" circle type="primary" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" @close="cancel" width="700px" :visible.sync="dialogTableVisible">
      <el-form size="small"  ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="省份名称" prop="provincename">
          <el-input type="text" v-model="addFormQuery.provincename" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="isuse">
          <el-select v-model="addFormQuery.isuse" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联用户">
          <el-transfer
            filterable
            filter-placeholder="请输入"
            v-model="addFormQuery.userids"
            :data="addLeftUserList">
          </el-transfer>
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
import {
  getProvince,
  addProvince,
  updateProvince,
  deleteProvince
} from "@/api/info";
import { role } from "@/utils";
import { getUserlist } from "@/api/user";

export default {
  name: 'province',
  data() {
    return {
      list: [],
      addLeftUserList:[],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      addFormQuery: {
        provincename: "",
        isuse: 1,
        userids: []
      },
      addRules: {
        provincename: {
          required: true,
          message: "请输入省份名称",
          trigger: "blur"
        },
        isuse: {
          required: true,
          message: "请选择是否有效"
        }
      },
      listQuery: {
        provincename: "",
        isuse:-1,
        pageIndex: 1,
        pageSize: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    isUse(data) {
      if (data == 0) return "否";
      else if (data == 1) return "是";
      else return "";
    },
    isRole(item) {
      return role(item)
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if(this.addLeftUserList.length==0){
        // 获取用户列表
        getUserlist().then(res => {
          res.userList.forEach((value, index, array) => {
            this.addLeftUserList.push({ label: value.username, key: value.userId });
          });
        });
      }
      if (type === "修改") {
        let userString = data.userids;
        this.addFormQuery = JSON.parse(JSON.stringify(data));
        this.addFormQuery.userids = [];
        this.addFormQuery.userids = userString.split(',');
        for(let i=0;i<this.addFormQuery.userids.length;i++){
          this.addFormQuery.userids[i] = parseInt(this.addFormQuery.userids[i])
        }
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        let query = this.addFormQuery;
        let userIdString = "";
        this.addFormQuery.userids.forEach((value, index, array) => {
          userIdString += value + ",";
        });
        query.userids = userIdString;
        if (valid && this.title === "新增") {
          addProvince(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          updateProvince(this.addFormQuery).then(res => {
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
        this.dialogTableVisible = false;
        this.addFormQuery = {
          provincename: "",
          isuse: 1,
          userids:[]
        };
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.clear();
    },
    clear() {
      this.listQuery = {
        provincename: "",
        isuse:1,
        pageIndex: 1,
        pageSize: 15
      };
      this.addFormQuery = {
        provincename: "",
        isuse: 1,
        userids:[]
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteProvince({ id: data.id }).then(res => {
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
    getListData() {
      this.listLoading = true;
      getProvince(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.getListData();
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
