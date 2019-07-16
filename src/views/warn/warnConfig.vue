<template>
  <div class="app-container">
    <el-form size="small"  ref="form" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
        <el-form-item label="报警项">
          <!-- <el-select @keyup.enter.native="getListData" v-model="listQuery.warnTermName" filterable placeholder="请选择">
            <el-option
              v-for="item in warnTypeList"
              :key="item.warnTermName"
              :label="item.warnTermName"
              :value="item.warnTermName">
            </el-option>
          </el-select> -->
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.warnTermName" placeholder="请输入" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button v-show="isRole('/warn/listdata')" type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button v-show="isRole('/warn/save')" type="primary" size="small" @click="edit('新增')">新增</el-button>
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
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column label="报警项" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.warnTermName }}
        </template>
      </el-table-column>
      <el-table-column label="是否推送"  align="center">
        <template slot-scope="scope">
          {{ scope.row.pushString }}
        </template>
      </el-table-column>
      <el-table-column label="标记位"  align="center">
        <template slot-scope="scope">
          {{ scope.row.flagBit }}
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/warn/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button size="mini" circle type="primary" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/warn/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button size="mini" circle type="primary" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" @close="cancel" width="30%" :visible.sync="dialogTableVisible">
      <el-form size="small"  ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="报警项名称" prop="warnTermName">
          <el-input type="text" v-model="addFormQuery.warnTermName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否推送" prop="isPush">
          <el-select v-model="addFormQuery.isPush" placeholder="请选择">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警标记位" prop="flagBit" >
          <el-input type="number" @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.flagBit" placeholder="请输入"></el-input>
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
      :current-page="listQuery.page"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getInstallList,
  getWarnTypeList,
  addConfig,
  editConfig,
  deleteConfig
} from "@/api/warn";
import { role } from "@/utils";

export default {
  name: 'warnConfig',
  data() {
    return {
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        warnTermName: "",
        isPush: true,
        flagBit: ""
      },
      addRules: {
        warnTermName: {
          required: true,
          message: "请输入报警项名称",
          trigger: "blur"
        },
        isPush: {
          required: true,
          message: "请选择是否推送"
        },
        flagBit: {
          required: true,
          message: "请输入报警标记位",
          trigger: "blur"
        }
      },
      listQuery: {
        warnTermName: "",
        page: 1,
        rows: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery = JSON.parse(JSON.stringify(data));
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addConfig(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editConfig(this.addFormQuery).then(res => {
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
          warnTermName: "",
          isPush: true,
          flagBit: ""
        };
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.addFormQuery = {
        warnTermName: "",
        isPush: true,
        flagBit: ""
      };
    },
    clear() {
      this.listQuery = {
        warnTermName: "",
        page: 1,
        rows: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteConfig({ id: data.warnId }).then(res => {
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
      getInstallList(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.getListData();
      // 查询报警项
      getWarnTypeList()
        .then(res => {
          this.warnTypeList = res.list;
        })
        .catch();
    },
    /**分页方法开始**/

    handleSizeChange(val) {
      this.listQuery.rows = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
    },
    prevClick() {
      this.listQuery.page--;
      this.fetchData();
    },
    nextClick() {
      this.listQuery.page++;
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
