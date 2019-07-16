<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="80px">
      <el-form-item label="车牌号">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.licenceNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.vin" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input clearable v-model="listQuery.customer" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车牌颜色">
          <el-select v-model="listQuery.licenceColor" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option label="渐变绿色" :value="1"></el-option>
            <el-option label="蓝色" :value="2"></el-option>
            <el-option label="黄色" :value="3"></el-option>
            <el-option label="白色" :value="4"></el-option>
            <el-option label="黄绿双拼色" :value="5"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="上牌类型">
        <el-select v-model="listQuery.type" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="个人" :value="0"/>
          <el-option label="企业" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="运营单位" >
          <el-select v-model="listQuery.companyId" placeholder="请选择">
            <el-option v-for="(item,index) in employeList" :key="index" :label="item.companyName" :value="item.id"/>
          </el-select>
        </el-form-item>
      <el-form-item label="行驶证注册日期" label-width="120px">
            <el-date-picker
              v-model="listQuery.licenceRegDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy/MM/dd HH:mm:ss"
              align="right">
            </el-date-picker>
        </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/licence/page')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/licence/insert')" type="primary" size="small" @click="edit('新增')">新增</el-button>
          <el-button v-show="isRole('/licence/importByExcel')" type="primary" size="small" @click="put">导入</el-button>
          <el-button v-show="isRole('/licence/exportList')" type="primary" size="small" @click="out">导出</el-button>
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
      max-height="652"
      stripe
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/licence/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/licence/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="车牌" :show-overflow-tooltip="true" align="center" width="110">
        <template slot-scope="scope">
          {{ scope.row.licenceNum }}
        </template>
      </el-table-column>
      <el-table-column label="VIN" :show-overflow-tooltip="true" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.vin }}
        </template>
      </el-table-column>
      <el-table-column label="车牌颜色" width="100" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ licenceColor(scope.row.licenceColor) }}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.customer }}
        </template>
      </el-table-column>
      <el-table-column label="上牌类型" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{licenceType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="运营单位" :show-overflow-tooltip="true" width="180" align="center">
        <template v-if="scope.row.company"  slot-scope="scope">
          {{ scope.row.company }}
        </template>
      </el-table-column>
      <el-table-column label="行驶证注册日期" :show-overflow-tooltip="true" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.licenceRegDate }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" :show-overflow-tooltip="true" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAccess }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="455px" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="120px">
        <el-form-item label="车牌" prop="licenceNum">
          <el-input  @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.licenceNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车辆VIN" prop="vin">
          <el-input v-model="addFormQuery.vin" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customer">
          <el-input v-model="addFormQuery.customer" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车牌颜色" prop="licenceColor">
          <el-select v-model="addFormQuery.licenceColor" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option label="渐变绿色" :value="1"></el-option>
            <el-option label="蓝色" :value="2"></el-option>
            <el-option label="黄色" :value="3"></el-option>
            <el-option label="白色" :value="4"></el-option>
            <el-option label="黄绿双拼色" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上牌类型" prop="type">
          <el-select  @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.type" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="个人" :value="0"/>
            <el-option label="企业" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="运营单位" prop="companyId">
          <el-select v-model="addFormQuery.companyId" placeholder="请选择">
            <el-option v-for="(item,index) in employeList" :key="index" :label="item.companyName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="行驶证注册日期" prop="licenceRegDate">
            <el-date-picker
              v-model="addFormQuery.licenceRegDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改结束 -->
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
import { parseTime,role } from "@/utils";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import {
  getLicenceInfoList,
  addLicence,
  getEmployeInfoList,
  getAllCompanyNameAndId,
  editLicence,
  deleteLicence,
  uploadLicence
} from "@/api/info";

export default {
  name: 'license',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      header: [
        "VIN",
        "车牌",
        "车牌颜色",
        "客户姓名",
        "上牌类型",
        "行驶证注册日期",
        "运营单位"
      ],
      uploadFile: {},
      tableData: [],
      tableHeader: [],
      employeList: [],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      warnTypeList: [],
      addFormQuery: {
        licenceNum: "",
        customer: "",
        licenceColor: -1,
        type: -1,
        licenceRegDate: null,
        companyId: "",
        vin: ""
      },
      addRules: {
        licenceNum: {
          required: true,
          message: "请输入车牌",
          trigger: "blur"
        },
        type: {
          required: true,
          message: "请选择上牌类型"
        },
        companyId: {
          required: true,
          message: "请选择运营单位"
        },
        flagBit: {
          required: true,
          message: "请输入报警标记位",
          trigger: "blur"
        },
        vin: {
          required: true,
          message: "请输入车辆VIN",
          trigger: "blur"
        },
        customer: {
          required: true,
          message: "请输入客户姓名",
          trigger: "blur"
        },
        licenceColor: {
          required: true,
          message: "请选择车牌颜色"
        },
        licenceRegDate: {
          required: true,
          message: "请选择日期",
          trigger: "blur"
        }
      },
      listQuery: {
        companyId: "",
        customer: "",
        licenceColor:-1,
        licenceRegDate: "",
        licenceNum: "",
        type: -1,
        vin:"",
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
    isRole(item) {
      return role(item)
    },
    download() {
      window.location.href = "/export/evLicence.xlsx";
    },
    /**导入开始**/
    put() {
      this.dialogTableVisible2 = true;
    },
    beforeUpload(file) {
      this.uploadFile = file;
      // const isLt1M = file.size / 1024 / 1024 < 1;
      //不限制文件大小
      const isLt1M = true;
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
      // if (JSON.stringify(this.header) !== JSON.stringify(header)) {
      //   this.$message({
      //     message: "文件内容格式不正确!",
      //     type: "error"
      //   });
      //   this.uploadFile = {};
      // }
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
        uploadLicence(form).then(res=>{
          this.$message({
            message: res.msg,
            type: "sucess"
          });
          this.getListData();
          this.dialogTableVisible2=false;

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
    licenceType(data) {
      if (data == -1) return "全部";
      else if (data == 0) return "个人";
      else if (data == 1) return "企业";
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
      let url= "/licence/exportList?customer=" +
        this.listQuery.customer +
        "&companyId=" + this.listQuery.companyId +
        "&licenceColor=" + this.listQuery.licenceColor +
        "&licenceNum=" + this.listQuery.licenceNum +
        "&vin=" + this.listQuery.vin +
        "&type=" + this.listQuery.type;
      if(this.listQuery.licenceRegDate){
        url +="&licenceRegDate=" + this.listQuery.licenceRegDate;
      }
      window.location.href = url
    },
    makeSure(formName) {
      this.addFormQuery.licenceRegDate = parseTime(
        this.addFormQuery.licenceRegDate
      );
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addLicence(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editLicence(this.addFormQuery).then(res => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else {
          return false;
        }
        this.cancel();
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.addFormQuery = {
        licenceNum: "",
        customer: "",
        licenceColor: -1,
        type: -1,
        licenceRegDate: null,
        companyId: ""
      };
    },
    clear() {
      this.listQuery = {
        companyId: "",
        customer: "",
        licenceColor:-1,
        licenceRegDate: "",
        licenceNum: "",
        type: -1,
        vin:"",
        pageIndex: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该车牌信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLicence({ id: data.id }).then(res => {
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
      getLicenceInfoList(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.getListData();
      // 获取单位列表
      // getEmployeInfoList({
      //   companyName: "",
      //   creditCode: "",
      //   pageNum: 1,
      //   pageSize: 10000,
      //   vehicleUse: ""
      // }).then(res => {
      //   this.employeList = res.data.list;
      // });
      //获取运营单位列表
      getAllCompanyNameAndId({
      }).then(res => {
        this.employeList = res.data;
      });
    },
    /**分页方法开始**/

    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getListData();
    },
    prevClick() {
      this.listQuery.pageIndex--;
      this.getListData();
    },
    nextClick() {
      this.listQuery.pageIndex++;
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
