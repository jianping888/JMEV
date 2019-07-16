<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="120px">
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.vin" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车型主码">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.vehicleModel" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="电池生产企业">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.batteryFactory" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="驱动机编号">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.engineNum" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="电池包型号">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.engineModel" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="公告批次">
        <el-input clearable @keyup.enter.native="getListData" placeholder="请输入" v-model="listQuery.noticeBatch" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车辆制造日期">
          <el-date-picker
            v-model="listQuery.manufactureDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions1"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="发证日期">
          <el-date-picker
            v-model="listQuery.issuingDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions1"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/certificate/queryPage')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/certificate/insert')" type="primary" size="small" @click="edit('新增')">新增</el-button>
          <el-button v-show="isRole('/certificate/importInsert')" type="primary" size="small" @click="put">导入</el-button>
          <el-button v-show="isRole('/certificate/exportList')" type="primary" size="small" @click="out">导出</el-button>
          <el-button type="primary" size="small" @click="download">导入模板下载</el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      size="mini"
      highlight-current-row
      :max-height="maxHeight"
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95" fixed>
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed>
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/certificate/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/certificate/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="VIN" width="180" align="center" fixed>
        <template slot-scope="scope">
          {{ scope.row.vin }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车型主码" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicleModel }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池包型号" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.engineModel}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动机编号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.engineNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池生产企业" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.batteryFactory }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池包编号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.batteryNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆制造日期" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.manufactureDate }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="发证日期" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.issuingDate }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="公告批次" align="center">
        <template slot-scope="scope">
          {{ scope.row.noticeBatch }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="455px" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="130px">
        <el-form-item label="VIN" prop="vin">
          <el-input @keyup.enter.native="makeSure('addForm')"  v-model="addFormQuery.vin" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车型主码">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.vehicleModel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池包型号">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.engineModel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池包编号">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.batteryNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="驱动机编号">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.engineNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池生产企业">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.batteryFactory" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="公告批次">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.noticeBatch" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车辆制造日期">
            <el-date-picker
              v-model="addFormQuery.manufactureDate"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1"
              align="right">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="发证日期">
            <el-date-picker
              v-model="addFormQuery.issuingDate"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1"
              align="right">
            </el-date-picker>
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
        <el-button @click="dialogTableVisible2=false">取 消</el-button>
        <el-button type="primary" @click="UploadmakeSure()">确 定</el-button>
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
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { parseTime,role } from "@/utils";
import {
  addCertificate,
  editCertificate,
  deleteCertificate,
  getCertificateList,
  uploadCertificate
} from "@/api/info";

export default {
  name: 'certificate',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      maxHeight:652,
      header: [
        "车架号",
        "车型主码",
        "电池包型号",
        "驱动及编号",
        "电池生产企业",
        "电池包编号",
        "车辆制造日期",
        "发证日期",
        "公告批次",
        "错误信息"
      ],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      dialogTableVisible2: false,
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        vin: "",
        batteryFactory: "",
        engineModel: "",
        batteryNum: "",
        engineNum: "",
        issuingDate: null,
        manufactureDate: null,
        noticeBatch: "",
        vehicleModel: ""
      },
      addRules: {
        vin: {
          required: true,
          message: "请输入VIN",
          trigger: "blur"
        }
      },
      listQuery: {
        issuingDate: null,
        manufactureDate: null,
        vin: "",
        vehicleModel:'',
        noticeBatch:'',
        id:'',
        engineNum:'',
        engineModel:'',
        batteryNum:'',
        batteryFactory:'',
        pageIndex: 1,
        pageSize: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  mounted(){
    this.maxHeight = `${document.documentElement.clientHeight}` - 98 - 188;
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    download() {
      window.location.href =
        "http://10.250.100.175:8081/export/evCertificate.xlsx";
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
        uploadCertificate(form).then(res=>{
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
    onlineSign(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "VIN";
      else if (data == 2) return "SN号";
      else if (data == 3) return "其他";
      else return "";
    },
    isLease(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "是";
      else if (data == 0) return "否";
      else return "";
    },
    isImport(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "是";
      else if (data == 0) return "否";
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
      const query =
        (this.listQuery.issuingDate == null
          ? ""
          : "&issuingDate=" + parseTime(this.listQuery.issuingDate)) +
        (this.listQuery.manufactureDate == null
          ? ""
          : "&manufactureDate=" + parseTime(this.listQuery.manufactureDate));
      window.location.href =
        "/vehicle/exportList?vin=" +
        this.listQuery.vin +
        "&vehicleModel=" +
        this.listQuery.vehicleModel +
        "&noticeBatch=" +
        this.listQuery.noticeBatch +
        "&batteryFactory=" +
        this.listQuery.batteryFactory +
        "&batteryNum=" +
        this.listQuery.batteryNum +
        "&engineModel=" +
        this.listQuery.engineModel +
        "&engineNum=" +
        this.listQuery.engineNum +
        query;
    },
    makeSure(formName) {
      this.addFormQuery.issuingDate =
        this.addFormQuery.issuingDate == null
          ? null
          : parseTime(this.addFormQuery.issuingDate);
      this.addFormQuery.manufactureDate =
        this.addFormQuery.manufactureDate == null
          ? null
          : parseTime(this.addFormQuery.manufactureDate);
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addCertificate(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editCertificate(this.addFormQuery).then(res => {
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
        vin: "",
        batteryFactory: "",
        engineModel: "",
        batteryNum: "",
        engineNum: "",
        issuingDate: null,
        manufactureDate: null,
        noticeBatch: "",
        vehicleModel: ""
      };
    },
    clear() {
      this.listQuery = {
        issuingDate: null,
        manufactureDate: null,
        vin: "",
        vehicleModel:'',
        noticeBatch:'',
        id:'',
        engineNum:'',
        engineModel:'',
        batteryNum:'',
        batteryFactory:'',
        pageIndex: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该合格证, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCertificate({ id: data.id }).then(res => {
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
      this.listQuery.issuingDate = parseTime(this.listQuery.issuingDate);
      this.listQuery.manufactureDate = parseTime(this.listQuery.manufactureDate);
      getCertificateList(this.listQuery).then(response => {
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
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px !important;
}
</style>
