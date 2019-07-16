<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" >
      <el-form-item label="单位名称">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.companyName" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="统一社会信用代码">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.creditCode" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车辆用途">
        <el-select v-model="listQuery.vehicleUse" placeholder="请选择">
          <el-option v-for="(item,index) in vehicleUseList" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/employe/page')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/employe/insert')" type="primary" size="small" @click="edit('新增')">新增</el-button>
          <el-button v-show="isRole('/employe/importInsert')" type="primary" size="small" @click="put">导入</el-button>
          <el-button v-show="isRole('/employe/exportList')" type="primary" size="small" @click="out">导出</el-button>
          <el-button type="primary" size="small" @click="download">导入模板下载</el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="mini"
      stripe
      max-height="652"
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageNum-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/employe/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/employe/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="单位名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column label="单位地址" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="座机" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="车辆用途" width="100" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{vehicleUse(scope.row.vehicleUse) }}
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.creditCode }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAccess }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="30%" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="110px">
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="addFormQuery.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="单位地址">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="座机">
          <el-input v-model="addFormQuery.telephone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车牌用途" prop="vehicleUse">
          <el-select v-model="addFormQuery.vehicleUse" placeholder="请选择">
            <el-option v-for="(item,index) in vehicleUseList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="统一社会信用码">
          <el-input v-model="addFormQuery.creditCode" placeholder="请输入"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入开始 -->
    <el-dialog title="导入" width="800px" top="50px" @close="dialogTableVisible2=false" :visible.sync="dialogTableVisible2">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row :max-height="300" style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTableVisible2=false">取 消</el-button>
        <el-button size="small" type="primary" @click="UploadmakeSure()">确 定</el-button>
        <el-button v-if="errExcelPath" type="primary" @click="downLog()">导出日志</el-button>
      </span>
    </el-dialog>
    <!-- 导入结束 -->
    <!-- 新增修改结束 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      prev-text="上一页"
      next-text="下一页"
      :current-page="listQuery.pageNum"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { role } from "@/utils";
import {
  addEmploye,
  getEmployeInfoList,
  editEmploye,
  deleteEmploye,
  uploadEmploye
} from "@/api/info";

export default {
  name: 'employe',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      header: [
        "运营单位名称",
        "统一社会信用代码",
        "单位地址",
        "座机",
        "车辆用途",
        "最后更新时间",
        "错误信息"
      ],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      dialogTableVisible2: false,
      vehicleUseList: [
        { label: "私人乘用车", value: 1 },
        { label: "租赁乘用车", value: 2 },
        { label: "出租乘用车", value: 3 },
        { label: "公务乘用车", value: 4 },
        { label: "环卫特种车", value: 5 },
        { label: "旅游客车", value: 6 },
        { label: "公路客车", value: 7 },
        { label: "邮政特种车", value: 8 },
        { label: "通勤客车", value: 9 },
        { label: "工程特种车", value: 10 },
        { label: "物流特种车", value: 11 },
        { label: "公交客车", value: 12 }
      ],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        companyName: "",
        address: "",
        telephone: "",
        vehicleUse: "",
        creditCode: ""
      },
      addRules: {
        companyName: {
          required: true,
          message: "请输入单位名称",
          trigger: "blur"
        },
        isPush: {
          required: true,
          message: "请选择是否推送"
        }
      },
      listQuery: {
        companyName: "",
        creditCode: "",
        vehicleUse: "",
        pageNum: 1,
        pageSize: 15
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
    download() {
      window.location.href = "http://10.250.100.175:8081/export/evCompany.xlsx";
    },
    /**导入开始**/
    put() {
      this.dialogTableVisible2 = true;
    },
    beforeUpload(file) {
      this.uploadFile = file;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "上传文件超过1M!",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      if (JSON.stringify(this.header) !== JSON.stringify(header)) {
        this.$message({
          message: "文件内容格式不正确!",
          type: "error"
        });
        this.uploadFile = {};
      }
    },

    UploadmakeSure() {
      var form = new FormData();
      var file = this.uploadFile;
      form.append("file", file);
      if (this.uploadFile.name === "") {
        this.$message({
          message: "请选择文件!",
          type: "error"
        });
      } else {
        uploadEmploye(form).then(res=>{
          this.$message({
            message: res.msg,
            type: "sucess"
          });
        }).catch(error=>{
            if(error.data.errExcelPath) this.errExcelPath = error.data.errExcelPath
        });
      }
    },
    // 导出日志
    downLog(){
      window.location.href =
        "/fileController/download?filename=" +
        this.errExcelPath
    },
    /**导入结束**/
    vehicleUse(data) {
      if (data == 1) return "私人乘用车";
      else if (data == 2) return "租赁乘用车";
      else if (data == 3) return "出租乘用车";
      else if (data == 4) return "公务乘用车";
      else if (data == 5) return "环卫特种车";
      else if (data == 6) return "旅游客车";
      else if (data == 7) return "公路客车";
      else if (data == 8) return "邮政特种车";
      else if (data == 9) return "通勤客车";
      else if (data == 10) return "工程特种车";
      else if (data == 11) return "物流特种车";
      else if (data == 12) return "公交客车";
      else return "";
    },
    licenceColor(data) {
      if (data == -1) return "无数据";
      else if (data == 1) return "渐变绿色";
      else if (data == 2) return "蓝色";
      else if (data == 3) return "黄色";
      else if (data == 4) return "白色";
      else if (data == 5) return "黄绿双拼色";
      else return "";
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery = JSON.parse(JSON.stringify(data));
      }
    },
    // 导出
    out() {
      window.location.href =
        "/employe/exportList?companyName=" +
        this.listQuery.companyName +
        "&creditCode=" +
        this.listQuery.creditCode +
        "&vehicleUse=" +
        this.listQuery.vehicleUse;
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addEmploye(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editEmploye(this.addFormQuery).then(res => {
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
      this.addFormQuery = {
        companyName: "",
        address: "",
        telephone: "",
        vehicleUse: "",
        creditCode: ""
      };
    },
    clear() {
      this.listQuery = {
        companyName: "",
        creditCode: "",
        vehicleUse: "",
        pageNum: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该单位信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteEmploye({ id: data.id }).then(res => {
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
      getEmployeInfoList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.listLoading = false;
        this.total = response.data.total;
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
      this.listQuery.pageNum = val;
      this.getListData();
    },
    prevClick() {
      this.listQuery.pageNum--;
      this.getListData();
    },
    nextClick() {
      this.listQuery.pageNum++;
      this.getListData();
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
