<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="110px">
      <el-form-item label="终端编号">
        <el-input clearable @keyup.enter.native="getListData"  v-model="listQuery.tboxNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="ICCID">
        <el-input clearable @keyup.enter.native="getListData"  v-model="listQuery.iccidNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable label="终端型号">
        <el-input v-model="listQuery.tboxModel" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable label="SIM卡号">
        <el-input v-model="listQuery.simNum" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable label="运营商">
        <el-input v-model="listQuery.operator" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable label="TBOX版本号">
        <el-input v-model="listQuery.tboxVersion" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="发货日期">
          <el-date-picker
            v-model="listQuery.supplyDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy/MM/dd HH:mm:ss"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="终端厂商">
        <el-select v-model="listQuery.tboxFactory" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="北京飞驰" :value="1"/>
          <el-option label="杭州云动" :value="2"/>
          <el-option label="其他" :value="3"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="流量卡状态">
        <el-select v-model="listQuery.flowState" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="可测试" :value="1"/>
          <el-option label="库存" :value="2"/>
          <el-option label="已激活" :value="3"/>
          <el-option label="已停用" :value="4"/>
          <el-option label="其他" :value="5"/>
        </el-select>
      </el-form-item> -->
      <el-form-item label="终端状态">
        <el-select v-model="listQuery.isUse" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="未使用" :value="0"/>
          <el-option label="已使用" :value="1"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button-group style="margin-left:20px;margin-bottom:20px;">
        <el-button v-show="isRole('/basic/queryEvTbox')" type="primary" size="small" @click="getListData">查询</el-button>
        <el-button type="primary" size="small" @click="clear">重置</el-button>
        <el-button v-show="isRole('/basic/addEvTbox')" type="primary" size="small" @click="edit('新增')">新增</el-button>
        <el-button v-show="isRole('/basic/addEvTboxsByExcel')" type="primary" size="small" @click="put">导入</el-button>
        <el-button v-show="isRole('/basic/exprotEvTbox')" type="primary" size="small" @click="out">导出</el-button>
        <el-button type="primary" size="small" @click="download">导入模板下载</el-button>
    </el-button-group>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="mini"
      stripe
      :max-height="maxHeight"
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95" fixed>
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed>
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/basic/updateEvTbox')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/basic/deleteEvTbox')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="终端编号" :show-overflow-tooltip="true" width="170" align="center" fixed> 
        <template slot-scope="scope">
          {{ scope.row.tboxNum }}
        </template>
      </el-table-column>
      <el-table-column label="ICCID" :show-overflow-tooltip="true" width="180" align="center" fixed>
        <template slot-scope="scope">
          {{ scope.row.iccidNum }}
        </template>
      </el-table-column>
      <el-table-column label="VIN" :show-overflow-tooltip="true" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.vin }}
        </template>
      </el-table-column>
      <el-table-column label="SIM卡号" :show-overflow-tooltip="true" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.simNum }}
        </template>
      </el-table-column>
      <el-table-column label="终端型号" :show-overflow-tooltip="true" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.tboxModel }}
        </template>
      </el-table-column>
      <el-table-column label="终端厂商" :show-overflow-tooltip="true" align="center" width="170">
        <template slot-scope="scope">
          {{tboxFactory(scope.row.tboxFactory) }}
        </template>
      </el-table-column>
      <el-table-column label="发货时间" width="170" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.supplyDate }}
        </template>
      </el-table-column>
      <el-table-column label="运营商" width="170" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.operator }}
        </template>
      </el-table-column>
      <el-table-column label="TBOX版本号" width="170" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.tboxVersion }}
        </template>
      </el-table-column>

      <el-table-column label="蓝牙MAC地址" width="150" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.bluetoothMac }}
        </template>
      </el-table-column>
      <el-table-column label="流量卡状态" width="150" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ flowState(scope.row.flowState) }}
        </template>
      </el-table-column>
      <el-table-column label="流量卡激活日期" width="170" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.activatedDate }}
        </template>
      </el-table-column>
      <el-table-column label="续费时间" width="170" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdTime }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" width="170" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAccess }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="40%" top="50px" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="120px">

        <el-form-item label="终端编号" prop="tboxNum">
          <el-input type="text" @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.tboxNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="ICCID" prop="iccidNum">
          <el-input type="text" @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.iccidNum" placeholder="请输入ICCID"></el-input>
        </el-form-item>
        <el-form-item label="车辆VIN">
          <el-input type="text" @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.vin" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="蓝牙MAC地址">
          <el-input type="text" v-model="addFormQuery.bluetoothMac" placeholder="请输入蓝牙MAC地址"></el-input>
        </el-form-item>
        <el-form-item label="流量卡激活日期">
            <el-date-picker
              v-model="addFormQuery.activatedDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="流量卡续费时间">
            <el-date-picker
              v-model="addFormQuery.chargeDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="SIM卡号">
          <el-input type="text" v-model="addFormQuery.simNum" placeholder="请输入SIM卡号"></el-input>
        </el-form-item>
        <el-form-item label="流量卡状态">
          <el-select v-model="addFormQuery.flowState" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="可测试" :value="1"/>
            <el-option label="库存" :value="2"/>
            <el-option label="已激活" :value="3"/>
            <el-option label="已停用" :value="4"/>
            <el-option label="其他" :value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="终端型号">
          <el-input type="text" v-model="addFormQuery.tboxModel" placeholder="请输入终端型号"></el-input>
        </el-form-item>
        <el-form-item label="发货时间">
            <el-date-picker
              v-model="addFormQuery.supplyDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="终端厂商">
          <el-select v-model="addFormQuery.tboxFactory" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="北京飞驰" :value="1"/>
            <el-option label="杭州云动" :value="2"/>
            <el-option label="其他" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商">
          <el-input type="text" v-model="addFormQuery.operator" placeholder="请输入运营商"></el-input>
        </el-form-item>
        <el-form-item label="TBOX版本号">
          <el-input type="text" v-model="addFormQuery.tboxVersion" placeholder="请输入TBOX版本号"></el-input>
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
        <el-button type="primary" @click="downLog()">导出日志</el-button>
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
      :current-page="listQuery.pageIndex"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getTboxInfoList,
  addEvTbox,
  editEvTbox,
  uploadEvTbox,
  deleteEvTbox
} from "@/api/info";
import { parseTime,role } from "@/utils";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import axios from "axios";

export default {
  name: 'tbox',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      maxHeight:652,
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
      header: [
        "终端品牌",
        "终端编号",
        "ICCID号",
        "蓝牙MAC地址",
        "终端型号",
        "发货日期",
        "流量卡状态",
        "流量卡激活日期",
        "流量卡续费时间",
        "SIM卡号",
        "创建时间",
        "版本号",
        "最后更新时间"
      ],
      tableData: [],
      tableHeader: [],
      list: [],
      uploadFile: {},
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      addFormQuery: {
        vin: "",
        tboxNum: "",
        tboxFactory: -1,
        bluetoothMac: "",
        iccidNum: "",
        activatedDate: null,
        chargeDate: null,
        simNum: "",
        flowState: -1,
        tboxModel: "",
        supplyDate: null,
        operator: '',
        tboxVersion: ""
      },
      addRules: {
        tboxNum: {
          required: true,
          message: "请输入终端编号",
          trigger: "blur"
        },
        iccidNum: {
          required: true,
          message: "请输入ICCID",
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
        isUse: -1,
        tboxFactory: -1,
        tboxNum: "",
        tboxModel: "",
        iccidNum: "",
        simNum: "",
        supplyDate: "",
        operator: "",
        tboxVersion: "",
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
    // 按钮级别权限判断
    isRole(item) {
      return role(item)
    },
    download(){
      window.location.href = 'http://10.250.100.175:8081/export/Tbox.xlsx'
    },
    /**导入开始**/
    put() {
      this.dialogTableVisible2 = true;
    },
    beforeUpload(file) {
      this.uploadFile = file;
      // const isLt1M = file.size / 1024 / 1024 < 1;
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
        uploadEvTbox(form).then(res=>{
          this.$message({
            message: res.msg,
            type: "sucess"
          });
          this.dialogTableVisible2=false
          this.getListData();
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
    tboxFactory(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "北京飞驰";
      else if (data == 2) return "杭州云动";
      else if (data == 3) return "其他";
      else return "";
    },
    flowState(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "可测试";
      else if (data == 2) return "库存";
      else if (data == 3) return "已激活";
      else if (data == 4) return "已停用";
      else if (data == 5) return "其他";
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
      let url= "/basic/exprotEvTbox?isUse=" +
        this.listQuery.isUse +
        "&tboxFactory=" +
        this.listQuery.tboxFactory +
        "&tboxNum=" +
        this.listQuery.tboxNum +
        "&tboxModel=" +
        this.listQuery.tboxModel +
        "&iccidNum=" +
        this.listQuery.iccidNum +
        "&simNum=" +
        this.listQuery.simNum +
        "&operator=" +
        this.listQuery.operator +
        "&tboxVersion=" + this.listQuery.tboxVersion;
      if(this.listQuery.supplyDate){
        url+="&supplyDate=" + this.listQuery.supplyDate;
      }
      window.location.href = url
    },
    makeSure(formName) {
      this.addFormQuery.supplyDate = parseTime(this.addFormQuery.supplyDate);
      // this.addFormQuery.createdTime =  parseTime(this.addFormQuery.createdTime);
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addEvTbox(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editEvTbox(this.addFormQuery).then(res => {
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
          vin: "",
          tboxNum: "",
          tboxFactory: -1,
          bluetoothMac: "",
          iccidNum: "",
          activatedDate: null,
          chargeDate: null,
          simNum: "",
          flowState: -1,
          tboxModel: "",
          supplyDate: null,
          operator: '',
          tboxVersion: ""
        };
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.addFormQuery = {
          vin: "",
          tboxNum: "",
          tboxFactory: -1,
          bluetoothMac: "",
          iccidNum: "",
          activatedDate: null,
          chargeDate: null,
          simNum: "",
          flowState: -1,
          tboxModel: "",
          supplyDate: null,
          operator: '',
          tboxVersion: ""
      };
    },
    clear() {
      this.listQuery = {
        isUse: -1,
        tboxFactory: -1,
        tboxNum: "",
        tboxModel: "",
        iccidNum: "",
        simNum: "",
        supplyDate: "",
        operator: "",
        tboxVersion: "",
        pageIndex: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      const _this = this;
      this.$confirm("此操作将永久删除该tbox信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteEvTbox({ id: data.id }).then(data => {
            _this.$message({
              type: "success",
              message: "删除成功!"
            });
            _this.getListData();
          });
      });
    },
    getListData() {
      this.listLoading = true;
      getTboxInfoList(this.listQuery).then(response => {
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
