<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="100px">
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.vinNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable @keyup.enter.native="getListData" label="T-BOX">
        <el-input v-model="listQuery.tboxNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item clearable @keyup.enter.native="getListData" label="ICCID">
        <el-input v-model="listQuery.iccid" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item  clearable @keyup.enter.native="getListData" label="车辆型号">
        <el-input v-model="listQuery.model" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车牌">
        <el-input v-model="listQuery.licenceNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="listQuery.customer" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="合格证号">
        <el-input v-model="listQuery.certificateNum" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车辆厂商">
        <el-input v-model="listQuery.vehicleFactory" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车系">
        <el-input v-model="listQuery.cartype" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="运营单位" >
          <el-select v-model="listQuery.companyId" placeholder="请选择">
            <el-option v-for="(item,index) in employeList" :key="index" :label="item.companyName" :value="item.id"/>
          </el-select>
        </el-form-item>
      <el-form-item label="车辆用途">
        <el-select v-model="listQuery.vehicleUse" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="私人乘用" :value="1"/>
          <el-option label="租赁乘用车" :value="2"/>
          <el-option label="出租乘用车" :value="3"/>
          <el-option label="公务乘用车" :value="4"/>
          <el-option label="环卫特种车" :value="5"/>
          <el-option label="旅游客车" :value="6"/>
          <el-option label="公路客车" :value="7"/>
          <el-option label="邮政特种车" :value="8"/>
          <el-option label="通勤客车" :value="9"/>
          <el-option label="工程特种车" :value="10"/>
          <el-option label="物流特种车" :value="11"/>
          <el-option label="公交客车" :value="12"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上线标识">
        <el-select v-model="listQuery.onlineSign" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="VIN" :value="1"/>
          <el-option label="SN号" :value="2"/>
          <el-option label="其他" :value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item label="导入信息">
        <el-select v-model="listQuery.isImport" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="分时租赁">
        <el-select v-model="listQuery.isLease" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="导入时间">
          <el-date-picker
            v-model="listQuery.importTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions1"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="是否为报废车">
        <el-select v-model="listQuery.isScrap" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="最后更新时间">
          <el-date-picker
            v-model="listQuery.lastAccess"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions1"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="总装下线时段">
          <el-date-picker
            v-model="listQuery.carTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期">
          </el-date-picker>
      </el-form-item>
    </el-form>
    <el-button-group style="margin-left:20px;margin-bottom:20px;">
        <el-button v-show="isRole('/vehicle/page')" type="primary" size="small" @click="getListData">查询</el-button>
        <el-button type="primary" size="small" @click="clear">重置</el-button>
        <el-button v-show="isRole('/vehicle/insert')" type="primary" size="small" @click="edit('新增')">新增</el-button>
        <el-button v-show="isRole('/vehicle/improtInsert')" type="primary" size="small" @click="put">导入</el-button>
        <el-button v-show="isRole('/vehicle/exportList')" type="primary" size="small" @click="out">导出</el-button>
        <el-button type="primary" size="small" @click="download">导入模板下载</el-button>
    </el-button-group>
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
      <el-table-column fixed align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/vehicle/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/vehicle/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column fixed :show-overflow-tooltip="true" label="VIN" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.vinNum }}
        </template>
      </el-table-column>
      <el-table-column fixed :show-overflow-tooltip="true" label="车牌" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.licenceNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="T-BOX" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.tboxNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="ICCID" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.iccid }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆型号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.model }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="客户名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.customer }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="合格证" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.certificateNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆厂商" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicleFactory }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="运营单位名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆用途" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicleUseString }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="上线标识" align="center">
        <template slot-scope="scope">
          {{ onlineSign(scope.row.onlineSign) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池包编号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.batteryNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机编号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.engineNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="总装下线时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.bornTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否为报废车" width="150" align="center">
        <template slot-scope="scope">
          {{ isScrap(scope.row.isScrap) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否分时租赁车" width="150" align="center">
        <template slot-scope="scope">
          {{ isLease(scope.row.isLease) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否导入静态信息" width="150" align="center">
        <template slot-scope="scope">
          {{ isImport(scope.row.isImport) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="导入静态时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.importTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最后更新时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAccess }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="30%" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="90px">
        <el-form-item label="VIN" prop="vinNum">
          <el-input @keyup.enter.native="makeSure('addForm')"  v-model="addFormQuery.vinNum" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="T-BOX" prop="tboxNum">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.tboxNum" placeholder="请输入"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="ICCID" prop="iccid">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.iccid" placeholder="请输入"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="车牌" prop="licence">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.licence" placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="车辆型号" prop="model">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.model" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="合格证" prop="certificateNum">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.certificateNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池包编号">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.batteryNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上线标识">
          <el-select v-model="addFormQuery.onlineSign" placeholder="请选择">
            <el-option label="VIN" :value="1"/>
            <el-option label="SN号" :value="2"/>
            <el-option label="其他" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分时租赁">
          <el-select v-model="addFormQuery.isLease" placeholder="请选择">
            <el-option label="是" :value="1"/>
            <el-option label="否" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否导入静态信息" label-width="130px">
          <el-select v-model="addFormQuery.isImport" placeholder="请选择">
            <el-option label="是" :value="1"/>
            <el-option label="否" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="总装下线时间" label-width="100px">
            <el-date-picker
              v-model="addFormQuery.bornTimeStart"
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
        <el-button @click="dialogTableVisible2=false;errExcelPath=''">取 消</el-button>
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
  getWarnTypeList,
  addCarInfo,
  editCarInfo,
  deleteCarInfo,
  getCarInfoList,
  uploadCarInfo,
  getAllCompanyNameAndId
} from "@/api/info";

export default {
  name: 'carInfo',
  components: { UploadExcelComponent },
  data() {
    return {
      employeList: [],
      errExcelPath:'',
      maxHeight:652,
      header: [
        "终端编号",
        "车架号",
        "车型代码",
        "总装下线时间",
        "电池包编号",
        "合格证号",
        "驱动电机编号",
        "是否核准信息",
        "上线识别码标记",
        "是否分时租赁车",
        "是否导入静态信息",
        "导入静态时间",
        "最后更新时间",
        "车辆厂商",
        "是否报废",
        "车型",
        "车牌号",
        "国家平台审核状态",
        "ICCID"
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
        vinNum: "",
        // tboxNum: "",
        // iccid:"",
        model: "",
        // licence:"",
        certificateNum:"",
        batteryNum: "",
        engineNum: "",
        bornTimeStart: null,
        onlineSign: "",
        isLease: "",
        isImport: ""
      },
      addRules: {
        vinNum: {
          required: true,
          message: "请输入VIN",
          trigger: "blur"
        },
        tboxNum: {
          required: true,
          message: "请输入tbox号",
          trigger: "blur"
        },
        model: {
          required: true,
          message: "请输入车辆型号",
          trigger: "blur"
        }
      },
      listQuery: {
        vinNum: "",
        tboxNum: "",
        iccid: "",
        model: "",
        bornTimeStart: null,
        bornTimeEnd: null,
        onlineSign: -1,
        isLease: -1,
        isImport: -1,
        importTime: null,
        lastAccess: null,
        licenceNum: "",
        customer: '',
        companyName: "",
        vehicleUse: -1,
        certificateNum: "",
        vehicleFactory: "",
        cartype: "",
        isScrap: -1,
        pageIndex: 1,
        pageSize: 15,
        carTime: []
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  mounted(){
    this.maxHeight = `${document.documentElement.clientHeight}` - 108 - 188;
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    download() {
      window.location.href =
        "/export/evBasicdata.xlsx";
    },
    /**导入开始**/
    put() {
      this.dialogTableVisible2 = true;
    },
    beforeUpload(file) {
      this.uploadFile = file;
      // const isLt1M = file.size / 1024 / 1024 < 1;
      //不校验文件大小
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
        uploadCarInfo(form).then(res=>{
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
    onlineSign(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "VIN";
      else if (data == 2) return "SN号";
      else if (data == 3) return "其他";
      else return "";
    },
    isScrap(data) {
      if (data == -1) return "全部";
      else if (data == 1) return "是";
      else if (data == 0) return "否";
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
      if (this.listQuery.carTime && this.listQuery.carTime.length > 0) {
        this.listQuery.bornTimeStart = this.listQuery.carTime[0];
        this.listQuery.bornTimeEnd = this.listQuery.carTime[1];
      } else {
        this.listQuery.bornTimeStart = null;
        this.listQuery.bornTimeEnd = null;
      }
      const query =
        (this.listQuery.bornTimeStart == null
          ? ""
          : "&bornTimeStart=" + parseTime(this.listQuery.bornTimeStart)) +
        (this.listQuery.bornTimeEnd == null
          ? ""
          : "&bornTimeEnd=" + parseTime(this.listQuery.bornTimeEnd)) +
        (this.listQuery.importTime == null
          ? ""
          : "&importTime=" + parseTime(this.listQuery.importTime));
      window.location.href =
        "/vehicle/exportList?vinNum=" +
        this.listQuery.vinNum +
        "&iccidNum=" +
        this.listQuery.iccid +
        "&isImport=" +
        this.listQuery.isImport +
        "&isLease=" +
        this.listQuery.isLease +
        "&model=" +
        this.listQuery.model +
        "&onlineSign=" +
        this.listQuery.onlineSign +
        "&tboxNum=" +
        this.listQuery.tboxNum +
        query;
    },
    makeSure(formName) {
      this.addFormQuery.bornTimeStart =
        this.addFormQuery.bornTimeStart == null
          ? null
          : parseTime(this.addFormQuery.bornTimeStart);
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addCarInfo(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editCarInfo(this.addFormQuery).then(res => {
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
        vinNum: "",
        // tboxNum: "",
        model: "",
        certificateNum:"",
        // licence:"",
        batteryNum: "",
        engineNum: "",
        bornTimeStart: null,
        onlineSign: "",
        isLease: "",
        isImport: null
      };
    },
    clear() {
      this.listQuery = {
        vinNum: "",
        tboxNum: "",
        iccid: "",
        model: "",
        bornTimeStart: null,
        bornTimeEnd: null,
        onlineSign: -1,
        isLease: -1,
        isImport: -1,
        importTime: null,
        lastAccess: null,
        licenceNum: "",
        customer: '',
        companyName: "",
        vehicleUse: -1,
        certificateNum: "",
        vehicleFactory: "",
        cartype: "",
        isScrap: -1,
        pageIndex: 1,
        pageSize: 15,
        carTime: []
      }
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该车辆信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCarInfo({ id: data.id }).then(res => {
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
      if (this.listQuery.carTime && this.listQuery.carTime.length > 0) {
        this.listQuery.bornTimeStart = parseTime(this.listQuery.carTime[0]);
        this.listQuery.bornTimeEnd = parseTime(this.listQuery.carTime[1]);
      } else {
        this.listQuery.bornTimeStart = null;
        this.listQuery.bornTimeEnd = null;
      }
      this.listQuery.importTime = parseTime(this.listQuery.importTime);
      getCarInfoList(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.getListData();
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
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px !important;
}
</style>
