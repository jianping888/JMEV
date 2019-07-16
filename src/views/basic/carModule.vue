<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="100px">
      <el-form-item label="车辆型号">
        <el-input v-model="listQuery.vehicleModel" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车辆配置名称">
        <el-input v-model="listQuery.parameterName" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="规约号">
        <el-input v-model="listQuery.statuteNum" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="电池包型号">
        <el-input v-model="listQuery.batteryModel" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="电池包数量">
        <el-input v-model="listQuery.batteryNumber" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="电池种类">
        <el-select v-model="listQuery.batteryType" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="三元材料电池" :value="1"/>
          <el-option label="磷酸铁锂电池" :value="2"/>
          <el-option label="聚合物锂离子电池" :value="3"/>
          <el-option label="钴酸锂电池" :value="4"/>
          <el-option label="锰酸锂电池" :value="5"/>
          <el-option label="钛酸锂电池" :value="6"/>
          <el-option label="其它类型电池" :value="7"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电机型号">
        <el-input v-model="listQuery.engineModel" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="驱动电机种类">
        <el-select v-model="listQuery.engineType" placeholder="请选择">
          <el-option label="全部" :value="-1"/>
          <el-option label="永磁同步" :value="1"/>
          <el-option label="交流异步" :value="2"/>
          <el-option label="无刷直流" :value="3"/>
          <el-option label="开关磁阻" :value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电机序号">
        <el-input v-model="listQuery.engineNumber" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车系">
        <el-input v-model="listQuery.cartype" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车系分类">
        <el-input v-model="listQuery.cartypeSort" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="车型代码">
        <el-input v-model="listQuery.vehicleCode" clearable @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/parameter/page')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/carType/insert')" type="primary" size="small" @click="edit('新增')">新增</el-button>
          <el-button v-show="isRole('/carType/importInsert')" type="primary" size="small" @click="put">导入</el-button>
          <el-button v-show="isRole('/carType/exportList')" type="primary" size="small" @click="out">导出</el-button>
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
      max-height="652"
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" fixed width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed>
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/carType/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/carType/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="车辆型号" align="center" width="120" fixed>
        <template slot-scope="scope">
          {{ scope.row.vehicleModel }}
        </template>
      </el-table-column>
      <el-table-column label="车牌配置" align="center" width="200" fixed>
        <template slot-scope="scope">
          {{ scope.row.parameterName }}
        </template>
      </el-table-column>
      <el-table-column label="规约号" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.statuteNum }}
        </template>
      </el-table-column>
      <el-table-column label="最高车速"  align="center">
        <template slot-scope="scope">
          {{scope.row.maxSpeed }}
        </template>
      </el-table-column>
      <el-table-column label="动力方式" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.powerWayString }}
        </template>
      </el-table-column>
      <el-table-column label="总储电量" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalEnergy }}
        </template>
      </el-table-column>
      <el-table-column label="续驶里程检测方式"  align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.checkWayString }}
        </template>
      </el-table-column>
      <el-table-column label="电动汽车续驶里程"  align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.holdMileage }}
        </template>
      </el-table-column>
      <el-table-column label="电池包型号" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.batteryModel }}
        </template>
      </el-table-column>
      <el-table-column label="电池包数量" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.batteryNumber }}
        </template>
      </el-table-column>
      <el-table-column label="储能装置总成标称电压"  align="center" width="160">
        <template slot-scope="scope">
          {{ scope.row.batteryRatedVoltage }}
        </template>
      </el-table-column>
      <el-table-column label="电池种类" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.batteryTypeString }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="电池包串并联方式"  align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.powerWay }}
        </template>
      </el-table-column> -->
      <el-table-column label="公告电机型号"  align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.engineModel }}
        </template>
      </el-table-column>
      <el-table-column label="驱动电机种类"  align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.engineTypeString }}
        </template>
      </el-table-column>
      <el-table-column label="电机位置" align="center">
        <template slot-scope="scope">
          {{ scope.row.engineLocation }}
        </template>
      </el-table-column>
      <el-table-column label="电机序号" align="center">
        <template slot-scope="scope">
          {{ scope.row.engineNumber }}
        </template>
      </el-table-column>
      <el-table-column label="电机冷却方式" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.engineCoolingModeString }}
        </template>
      </el-table-column>
      <el-table-column label="电机额定电压" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.engineRatedVoltage }}
        </template>
      </el-table-column>
      <el-table-column label="电机峰值功率" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.peakPower }}
        </template>
      </el-table-column>
      <el-table-column label="电机最高转速" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.engineMaxSpeed }}
        </template>
      </el-table-column>
      <el-table-column label="电机峰值转矩" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.enginePeakTorque }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAccess }}
        </template>
      </el-table-column>
      <el-table-column label="车系" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.cartype }}
        </template>
      </el-table-column>
      <el-table-column label="车系分类" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.cartypeSort }}
        </template>
      </el-table-column>
      <el-table-column label="车型代码" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicleCode }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.createtime }}
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" width="850px" top="0" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form size="small" ref="addForm" :inline="true" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="160px">
        <el-form-item label="车辆型号" :show-overflow-tooltip="true" prop="vehicleModel">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.vehicleModel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车辆配置名称" :show-overflow-tooltip="true" prop="parameterName">
          <el-input @keyup.enter.native="makeSure('addForm')" v-model="addFormQuery.parameterName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="规约号" :show-overflow-tooltip="true"> 
          <el-input v-model="addFormQuery.statuteNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="最高车速" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.maxSpeed" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="动力方式" :show-overflow-tooltip="true">
          <el-select v-model="addFormQuery.powerWay" placeholder="请选择">
            <el-option label="全部(默认为纯电)" :value="1"/>
            <el-option label="纯电动汽车(BEV)" :value="1"/>
            <el-option label="插电式混合动力汽车(PHEV)" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="总储电量">
          <el-input type="number" v-model="addFormQuery.totalEnergy" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="续驶里程检测方式">
          <el-select v-model="addFormQuery.checkWay" placeholder="请选择">
            <el-option label="工况法" :value="1"/>
            <el-option label="等速法" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电动汽车续驶里程" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.holdMileage" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池包型号">
          <el-input v-model="addFormQuery.batteryModel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池包数量" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.batteryNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="储能装置总成标称电压" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.batteryRatedVoltage" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电池种类">
          <el-select v-model="addFormQuery.batteryType" placeholder="请选择">
            <el-option label="请选择" :value="-1"/>
            <el-option label="三元材料电池" :value="1"/>
            <el-option label="聚合物锂离子电池" :value="2"/>
            <el-option label="钴酸锂电池" :value="3"/>
            <el-option label="锰酸锂电池" :value="4"/>
            <el-option label="钛酸锂电池" :value="5"/>
            <el-option label="其它类型电池" :value="6"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电池包串并联方式" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.batteryLineWay" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机型号" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.engineModel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="驱动电机种类" :show-overflow-tooltip="true">
          <el-select v-model="addFormQuery.engineType" placeholder="请选择">
            <el-option label="请选择" :value="-1"/>
            <el-option label="永磁同步" :value="1"/>
            <el-option label="交流异步" :value="2"/>
            <el-option label="无刷直流" :value="3"/>
            <el-option label="开关磁阻" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电机位置" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.engineLocation" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机序号" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.engineNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机冷却方式" :show-overflow-tooltip="true">
          <el-select v-model="addFormQuery.engineCoolingMode" placeholder="请选择">
            <el-option label="请选择" :value="-1"/>
            <el-option label="液冷" :value="1"/>
            <el-option label="油冷" :value="2"/>
            <el-option label="无风冷刷直流" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电机额定电压" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.engineRatedVoltage" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机峰值功率" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.peakPower" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机最高转速" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.engineMaxSpeed" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电机峰值转矩" :show-overflow-tooltip="true">
          <el-input type="number" v-model="addFormQuery.enginePeakTorque" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车系" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.cartype" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车系分类" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.cartypeSort" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车型代码" :show-overflow-tooltip="true">
          <el-input v-model="addFormQuery.vehicleCode" placeholder="请输入"></el-input>
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
import {
  addCarModule,
  editCarModule,
  deleteCarModule,
  getCarModuleInfoList,
  uploadCarModule
} from "@/api/info";
import { role } from "@/utils";

export default {
  name: 'carModule',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      header: [
        "车辆型号",
        "车辆配置名称",
        "规约号",
        "最高车速",
        "动力方式",
        "总储电量",
        "续驶里程检测方式",
        "电动汽车续驶里程",
        "电池包型号",
        "电池包数量",
        "储能装置总成标称电压",
        "电池种类",
        "电池包串并联方式",
        "电机型号",
        "驱动电机种类",
        "电机位置",
        "电机序号",
        "电机冷却方式",
        "电机额定电压",
        "电机峰值功率",
        "电机最高转速",
        "电机峰值转矩",
        "版本号",
        "最后更新时间",
        "创建时间"
      ],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      dialogTableVisible2: false,
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        vehicleModel: "",
        parameterName: "",
        statuteNum: "",
        maxSpeed: "",
        powerWay: 1,
        totalEnergy: "",
        checkWay: 1,
        holdMileage: "",
        batteryModel: "",
        batteryNumber: "",
        batteryRatedVoltage: "",
        batteryType: -1,
        batteryLineWay: "",
        engineModel: "",
        engineType: -1,
        engineLocation: "",
        engineNumber: "",
        engineCoolingMode: -1,
        engineRatedVoltage: "",
        peakPower: "",
        engineMaxSpeed: "",
        enginePeakTorque: "",
        cartype: "",
        cartypeSort: "",
        vehicleCode: ""
      },
      addRules: {
        vehicleModel: {
          required: true,
          message: "请输入车辆型号",
          trigger: "blur"
        },
        parameterName: {
          required: true,
          message: "请输入车辆配置名称",
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
        vehicleModel: "",
        parameterName: "",
        statuteNum: "",
        batteryModel: "",
        batteryNumber: "",
        batteryType: -1,
        engineModel: "",
        engineType: -1,
        engineNumber: "",
        cartype: "",
        cartypeSort: "",
        vehicleCode: "",
        pageIndex: 1,
        pageSize: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  computed: {},
  methods: {
    isRole(item) {
      return role(item)
    },
    download() {
      window.location.href = "/export/Parameter.xlsx";
    },
    /**导入开始**/
    put() {
      this.dialogTableVisible2 = true;
    },
    beforeUpload(file) {
      this.uploadFile = file;
      // const isLt1M = file.size / 1024 / 1024 < 1;
      const isLt1M = true; //不校验文件大小
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
        uploadCarModule(form).then(res=>{
          this.$message({
            message: res.msg,
            type: "sucess"
          });
          this.dialogTableVisible2 = false;
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
      window.location.href =
        "/parameter/exportList?vehicleModel=" + this.listQuery.vehicleModel +
        "&parameterName=" + this.listQuery.parameterName +
        "&statuteNum=" + this.listQuery.statuteNum +
        "&batteryModel=" + this.listQuery.batteryModel +
        "&batteryNumber=" + this.listQuery.batteryNumber +
        "&batteryType=" + this.listQuery.batteryType +
        "&engineModel=" + this.listQuery.engineModel +
        "&engineType=" + this.listQuery.engineType +
        "&engineNumber=" + this.listQuery.engineNumber +
        "&cartype=" + this.listQuery.cartype +
        "&cartypeSort=" + this.listQuery.cartypeSort +
        "&vehicleCode=" + this.listQuery.vehicleCode;
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addCarModule(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editCarModule(this.addFormQuery).then(res => {
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
        vehicleModel: "",
        parameterName: "",
        statuteNum: "",
        maxSpeed: "",
        powerWay: 1,
        totalEnergy: "",
        checkWay: 1,
        holdMileage: "",
        batteryModel: "",
        batteryNumber: "",
        batteryRatedVoltage: "",
        batteryType: -1,
        batteryLineWay: "",
        engineModel: "",
        engineType: -1,
        engineLocation: "",
        engineNumber: "",
        engineCoolingMode: -1,
        engineRatedVoltage: "",
        peakPower: "",
        engineMaxSpeed: "",
        enginePeakTorque: "",
        cartype: "",
        cartypeSort: "",
        vehicleCode: ""
      };
    },
    clear() {
      this.listQuery = {
        vehicleModel: "",
        parameterName: "",
        statuteNum: "",
        batteryModel: "",
        batteryNumber: "",
        batteryType: -1,
        engineModel: "",
        engineType: -1,
        engineNumber: "",
        cartype: "",
        cartypeSort: "",
        vehicleCode: "",
        pageIndex: 1,
        pageSize: 15
      }
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该车型信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCarModule({ id: data.id }).then(res => {
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
      getCarModuleInfoList(this.listQuery).then(response => {
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
</style>
