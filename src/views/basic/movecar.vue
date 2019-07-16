<template>
  <div class="app-container">
    <el-form size="small" ref="form" :inline="true" :model="listQuery" label-width="80px">
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.vin" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="下线时段">
        <el-date-picker
          v-model="listQuery.carTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          :picker-options="pickerOptions1"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="周期">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions1"
            align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="是否成功">
        <el-select v-model="listQuery.isSuccess" placeholder="请选择">
          <el-option label="请选择" :value="-1"/>
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button-group style="margin-left:20px;margin-bottom:20px;">
        <el-button v-show="isRole('/movethecar/queryPage')" type="primary" size="small" @click="getListData">查询</el-button>
        <el-button type="primary" size="small" @click="clear">重置</el-button>
        <el-button v-show="isRole('/movethecar/importQuery')" type="primary" size="small" @click="put">导入</el-button>
        <el-button type="primary" size="small" @click="out">导出</el-button>
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
      max-height="652"
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="VIN" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.vin }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="审核周期" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.day }}
        </template>
      </el-table-column>
      <el-table-column label="是否有启动状态" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.initateStr}}
        </template>
      </el-table-column>
      <el-table-column label="是否有熄火状态" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.flameoutStr }}
        </template>
      </el-table-column>
      <el-table-column label="是否有充电状态" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.rechargeStr }}
        </template>
      </el-table-column>
      <el-table-column label="是否有行驶状态" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.runStr }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最新启动时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.initateTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最新熄火时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.flameoutTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最新充电时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.rechargeTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最新行驶时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.runTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="满足状态时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.finishTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="启动报文数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.initiateNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="熄火报文数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.flameoutNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="充电报文数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.rechargeNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="行驶报文数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.runNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="里程数" align="center">
        <template slot-scope="scope">
          {{ scope.row.mileage }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车速" align="center">
        <template slot-scope="scope">
          {{ scope.row.carspeed }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="经度" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.longitude }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="纬度" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.latitude }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆位置" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 导入开始 -->
    <el-dialog title="导入" width="800px" top="50px" @close="dialogTableVisible2=false" :visible.sync="dialogTableVisible2">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <div class="pickerTime">
        <span class="title">导入时间</span>
        <el-date-picker
          v-model="timeValue"
          type="datetimerange"
          :picker-options="pickerOptions1"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </div>
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
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { getMovecarList, uploadMoveCar } from "@/api/info";
import { parseTime, role } from "@/utils";

export default {
  name: 'movecar',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      timeValue: "",
      header: ["VIN"],
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
      carTime:[],
      listQuery: {
        finishTimeEnd: null,
        vin: "",
        finishTimeStart: null,
        startTime: null,
        isSuccess: -1,
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
      window.location.href =
        "http://10.250.100.175:8081/export/groupVehicle.xlsx";
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
      if(this.timeValue[0]&&this.timeValue[0].length>0){
       form.append("finishTimeStart", parseTime(this.timeValue[0]));
      }
      if(this.timeValue[1]&&this.timeValue[1].length>0){
        form.append("finishTimeEnd", parseTime(this.timeValue[1]));
      }
      if (this.uploadFile.name === "") {
        this.$message({
          message: "请选择文件!",
          type: "error"
        });
      } else {
        uploadMoveCar(form).then(res=>{
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
    // 导出
    out() {
      if (this.listQuery.carTime && this.listQuery.carTime.length > 0) {
        this.listQuery.finishTimeStart = this.listQuery.carTime[0];
        this.listQuery.finishTimeEnd = this.listQuery.carTime[1];
      } else {
        this.listQuery.finishTimeStart = null;
        this.listQuery.finishTimeEnd = null;
      }
      const query =
        (this.listQuery.finishTimeStart == null
          ? ""
          : "&finishTimeStart=" + parseTime(this.listQuery.finishTimeStart)) +
        (this.listQuery.finishTimeEnd == null
          ? ""
          : "&finishTimeEnd=" + parseTime(this.listQuery.finishTimeEnd)) +
        (this.listQuery.day == null
          ? ""
          : "&day=" + parseTime(this.listQuery.day));
      window.location.href =
        "/movethecar/queryExport?vin=" +
        this.listQuery.vin +
        "&isSuccess=" +
        this.listQuery.isSuccess +
        query;
    },
    clear() {
      this.listQuery = {
        finishTimeEnd: null,
        vin: "",
        finishTimeStart: null,
        startTime: null,
        isSuccess: -1,
        pageIndex: 1,
        pageSize: 15
      };
    },
    getListData() {
      this.listLoading = true;
      if (this.listQuery.carTime && this.listQuery.carTime.length > 0) {
        this.listQuery.finishTimeStart = parseTime(this.listQuery.carTime[0]);
        this.listQuery.finishTimeEnd = parseTime(this.listQuery.carTime[1]);
      } else {
        this.listQuery.finishTimeStart = null;
        this.listQuery.finishTimeEnd = null;
      }
      getMovecarList(this.listQuery).then(response => {
        this.list = response.pageInfo.list;
        this.listLoading = false;
        this.total = response.pageInfo.total;
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
.pickerTime {
  align-items: center;
  display: flex;
  margin: 20px 0;
}
.title {
  margin-right: 20px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px !important;
}
</style>
