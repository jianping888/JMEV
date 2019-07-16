<template>
  <div class="app-container">
    <el-form :inline="true" size="small" ref="form" :model="listQuery" label-width="100px">
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.vin" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="故障ID">
        <el-input clearable @keyup.enter.native="getListData" type="number" v-model="listQuery.id" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="报警等级">
        <el-select  @keyup.enter.native="getListData" v-model="listQuery.level" placeholder="请选择">
          <el-option label="全部" value=""/>
          <el-option label="1级" value="1"/>
          <el-option label="2级" value="2"/>
          <el-option label="3级" value="3"/>
          <el-option label="无效" value="-1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="报警结束">
        <el-select  @keyup.enter.native="getListData" v-model="listQuery.warnIsEnd" placeholder="请选择">
          <el-option label="全部" value="-1"/>
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select  @keyup.enter.native="getListData" v-model="listQuery.disposeStatus" placeholder="请选择">
          <el-option label="全部" value=""/>
          <el-option label="故障未处理" :value="-1"/>
          <el-option label="故障处理中" :value="0"/>
          <el-option label="故障已处理" :value="1"/>
          <el-option label="故障忽略" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="报警项">
        <el-select collapse-tags @remove-tag="listQuery.warnType=[]" v-model="listQuery.warnType" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in warnTypeList"
            :key="item.flagBit"
            :label="item.warnTermName"
            :value="item.flagBit">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车型">
        <el-select collapse-tags @remove-tag="listQuery.cartype=[]" v-model="listQuery.cartype" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in carModelList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在省份">
        <el-select collapse-tags @remove-tag="listQuery.provinceIdArray=[]" v-model="listQuery.provinceIdArray" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.provincename"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障时间">
          <!-- <el-date-picker
            v-model="listQuery.warnTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期">
          </el-date-picker> -->
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="auto" >
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="处理时间">
          <!-- <el-form-item label="处理时间">
          <el-date-picker
            v-model="listQuery.disposeTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期">
          </el-date-picker>
      </el-form-item> -->
          <el-date-picker
            v-model="listQuery.disposeStartTime"
            type="datetime"
            placeholder="开始日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="至" label-width="auto" >
          <el-date-picker
            v-model="listQuery.disposeEndTime"
            type="datetime"
            placeholder="结束日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="分组">
        <el-select @keyup.enter.native="getListData" v-model="listQuery.groupSqlValue" collapse-tags clearable multiple filterable placeholder="请选择">
          <el-option
            v-for="item in groupSqlList"
            :key="item.id"
            :label="item.groupName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    <el-button-group style="margin-left:20px;margin-bottom:20px;">
        <el-button type="primary" size="small"  @click="getListData">查询</el-button>
        <el-button type="primary" size="small"  @click="clear">重置</el-button>
        <el-button v-show="isRole('/warnquery/disposeSave')" type="primary" size="small"  @click="checkAll">批处理</el-button>
        <el-button type="primary" size="small"  @click="out">导出</el-button>
        <el-button type="primary" size="small"  @click="imp">导入处理结果</el-button>
    </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      ref="singleTable"
      @selection-change = "handleSelectionChange"
      element-loading-text="Loading"
      border
      fit
      stripe
      size="mini"
      highlight-current-row
      :max-height="maxHeight"
      style="width: 100%">
      <el-table-column fixed align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column fixed align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/MongoController/searchMsg')" class="item" effect="dark" content="查看报文" placement="left">
              <el-button size="mini" circle type="primary"  icon="el-icon-search" @click="push(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/warnquery/disposeSave')" class="item" effect="dark" content="处理故障" placement="right">
              <el-button size="mini" circle type="primary"  icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column fixed label="故障ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column fixed label="VIN" :show-overflow-tooltip="true" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警等级" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.warnLevel }}
        </template>
      </el-table-column>
      <el-table-column label="报警项" :show-overflow-tooltip="true" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.warnFlag }}
        </template>
      </el-table-column>
      <el-table-column label="SOC" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.socString }}
        </template>
      </el-table-column>
      <el-table-column label="车速" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclespeedString }}
        </template>
      </el-table-column>
      <el-table-column label="里程" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.mileageString }}
        </template>
      </el-table-column>
      <el-table-column label="最高温度" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.maxtemperatureString }}
        </template>
      </el-table-column>
      <el-table-column label="最低温度" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.mintemperatureString }}
        </template>
      </el-table-column>
      <el-table-column label="温差" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.maxtemperatureString-scope.row.mintemperatureString }}
        </template>
      </el-table-column>
      <el-table-column label="最高电压"  :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.maxvoltageString }}
        </template>
      </el-table-column>
      <el-table-column label="最低电压"  :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.minvoltageString }}
        </template>
      </el-table-column>
      <el-table-column label="压差" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.maxvoltageString-scope.row.minvoltageString }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="SOC"  align="center">
        <template slot-scope="scope">
          {{ scope.row.socString }}
        </template>
      </el-table-column> -->
      <el-table-column label="故障开始时间" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="故障结束时间" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="150" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.longitudeString }}
        </template>
      </el-table-column>
      <el-table-column label="经度" width="150" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.latitudeString }}
        </template>
      </el-table-column>
      <el-table-column label="车辆位置" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="处理状态" width="100" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.statusStrig }}
        </template>
      </el-table-column>
      <el-table-column label="响应时间" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.disposeTime }}
        </template>
      </el-table-column>
      
    </el-table>
    <!-- 处理故障表单开始 -->
    <el-dialog title="故障处理" width="500" @close="cancel" :visible.sync="dialogTableVisible">
      <el-form ref="editForm" size="small" :rules="editRules" :model="editFormQuery" class="editForm-form" auto-complete="on" label-position="right">
        <el-form-item label="故障原因分析" prop="disposeReason">
          <el-input  type="textarea" v-model="editFormQuery.disposeReason"></el-input>
        </el-form-item>
        <el-form-item label="处理意见" prop="disposeSuggestion">
          <el-input  type="textarea" v-model="editFormQuery.disposeSuggestion"></el-input>
        </el-form-item>
        <el-form-item label="处理时间" prop="disposeTime">
          <el-date-picker
            v-model="editFormQuery.disposeTime"
            type="datetime"
            placeholder="选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理状态" prop="disposeStatus">
          <el-select  v-model="editFormQuery.disposeStatus" placeholder="请选择">
            <el-option label="故障处理中" :value="0"></el-option>
            <el-option label="故障已处理" :value="1"></el-option>
            <el-option label="故障忽略" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人">
          <span>{{editFormQuery.user}}</span>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 处理故障表单结束 -->
    <!-- 导入开始 -->
    <el-dialog title="导入" width="800px" top="50px" @close="dialogTableVisible2=false" :visible.sync="dialogTableVisible2">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row :max-height="300" style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2=false">取 消</el-button>
        <el-button type="primary" @click="UploadmakeSure()">确 定</el-button>
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
      :current-page="listQuery.page"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import {
  getList,
  getCarModel,
  getGroupList,
  getWarnTypeList,
  disposeDetail,
  disposeSave,
  getProvinceAll,
  disposeSaveAll,
  uploadDispose
} from "@/api/warn";
import { parseTime, role } from "@/utils";

export default {
  name: "warnSearch",
  components: { UploadExcelComponent },
  data() {
    return {
      maxHeight: 652,
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
      editRules: {
        disposeReason: {
          required: true,
          message: "请输入故障原因分析",
          trigger: "blur"
        },
        disposeStatus: {
          required: true,
          message: "请选择处理状态",
          trigger: "blur"
        },
        disposeSuggestion: {
          required: true,
          message: "请输入处理意见",
          trigger: "blur"
        },
        name: { required: true }
      },
      header: [
        "故障ID",
        "VIN",
        "告警等级",
        "告警内容",
        "SOC",
        "车速",
        "行驶里程",
        "最高温度",
        "最低温度",
        "最高电压",
        "最低电压",
        "故障原因分析",
        "故障处理人",
        "故障原因",
        "故障处理意见",
        "故障处理状态",
        "故障处理时间"
      ],
      thisData: [], // 当前选中数据
      list: [],
      editFormQuery: {
        disposeReason: "",
        disposeSuggestion: "",
        disposeStatus: "",
        disposeTime: null,
        user:"",
        warnId: ""
      },
      groupSqlList: [],
      carModelList: [],
      warnTypeList: [],
      provinceList:[],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      dialogTableVisible: false,
      dialogTableVisible2: false,
      listLoading: false,
      listQuery: {
        vin: "",
        level: "",
        disposeStatus: "",
        sort: "",
        id: "",
        page: 1,
        rows: 15,
        warnIsEnd: "-1",
        provinceIdArray:[],
        provinceIds:'',
        groupSqlValue: [],
        groupSql: "",
        warnType: [],
        cartype: [],
        startTime: null,
        endTime: null,
        disposeStartTime: null,
        disposeEndTime: null
      },
      total: 0
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    this.maxHeight = `${document.documentElement.clientHeight}` - 128 - 188;
  },
  created() {
    this.fetchData();
  },
  methods: {
    checkAll() {
      if (this.editFormQuery.warnId && this.editFormQuery.warnId !== "") {
        this.dialogTableVisible = true;
      } else {
        this.$message({
          message: "请选择故障",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    isRole(item) {
      return role(item);
    },
    push(data) {
      this.$router.push({ path: "/monitoring", query: { vin: data.vin } });
    },
    //导出
    out() {
      const query =
        (this.listQuery.startTime == null
          ? ""
          : "&startTime=" + parseTime(this.listQuery.startTime)) +
        (this.listQuery.endTime == null
          ? ""
          : "&endTime=" + parseTime(this.listQuery.endTime)) +
        (this.listQuery.disposeStartTime == null
          ? ""
          : "&disposeStartTime=" + parseTime(this.listQuery.disposeStartTime)) +
        (this.listQuery.disposeEndTime == null
          ? ""
          : "&disposeEndTime=" + parseTime(this.listQuery.disposeEndTime));
      window.location.href =
        "/warnquery/export?vin=" +
        this.listQuery.vin +
        "&warnType=" +
        this.listQuery.warnType +
        "&cartype=" +
        this.listQuery.cartype +
        "&level=" +
        this.listQuery.level +
        "&disposeStatus=" +
        this.listQuery.disposeStatus +
        "&warnIsEnd=" +
        this.listQuery.warnIsEnd +
        "&provinceIds=" +
        this.listQuery.provinceIds +
        "&groupSql=" +
        this.listQuery.groupSql +
        query;
    },
    imp(){
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
      console.log(header);
      // if (JSON.stringify(this.header) !== JSON.stringify(header)) {
      //   this.$message({
      //     message: "文件内容格式不正确!",
      //     type: "error"
      //   });
      //   //this.uploadFile = {};
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
        uploadDispose(form).then(res=>{
          this.$message({
            message: "导入成功！",
            type: "sucess"
          });
        }).catch(error=>{
            this.$message({
              message: "导入失败!",
              type: "error"
            });
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    // 处理故障
    edit(data) {
      this.thisData = data;
      disposeDetail({ warnId: data.id }).then(res => {
        console.log(res);
        this.editFormQuery = {
          disposeReason: res ? res.disposeReason : "",
          disposeStatus: res ? res.disposeStatus : "",
          disposeSuggestion: res ? res.disposeSuggestion : "",
          disposeTime:res?res.disposeTime:null,
          user:res ? res.username : this.name,
          warnId: data.id
        };
        this.dialogTableVisible = true;
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.editFormQuery = {
        disposeReason: "",
        disposeStatus: "",
        disposeSuggestion: "",
        disposeTime: null,
        user:"",
        warnId: ""
      };
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogTableVisible = false;
          this.editFormQuery.user = null;
          if (this.editFormQuery.disposeTime) {
              this.editFormQuery.disposeTime = parseTime(this.editFormQuery.disposeTime);
          }
          if (JSON.stringify(this.editFormQuery.warnId).indexOf(",") == -1) {
            disposeSave(this.editFormQuery).then(res => {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 5 * 1000
              });
              this.getListData();
              this.editFormQuery = {
                disposeReason: "",
                disposeStatus: "",
                disposeSuggestion: "",
                disposeTime: null,
                user:"",
                warnId: ""
              };
            });
          } else {
            let query = this.editFormQuery;
            query.wId = this.editFormQuery.warnId;
            delete query.warnId;
            disposeSaveAll(query).then(res => {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 5 * 1000
              });
              this.getListData();
              this.editFormQuery = {
                disposeReason: "",
                disposeStatus: "",
                disposeSuggestion: "",
                disposeTime: null,
                user:"",
                warnId: ""
              };
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 多选
    handleSelectionChange(val) {
      this.editFormQuery.warnId = "";
      let list = [];
      val.forEach((value, index, array) => {
        this.editFormQuery.warnId += value.id + ",";
      });
      this.editFormQuery.warnId = this.editFormQuery.warnId.slice(0, -1);
    },
    // 查询
    getListData() {
      this.listLoading = true;
      this.listQuery.groupSql = "";
      this.listQuery.provinceIds = "";
      this.listQuery.groupSqlValue.forEach(value => {
        this.listQuery.groupSql += value + ",";
      });
      this.listQuery.provinceIdArray.forEach(value => {
        this.listQuery.provinceIds += value + ",";
      });
      this.listQuery.provinceIds = this.listQuery.provinceIds.substr(0,this.listQuery.provinceIds.length-1);
      if (this.listQuery.startTime) {
        this.listQuery.startTime = parseTime(this.listQuery.startTime);
      }
      if (this.listQuery.endTime) {
        this.listQuery.endTime = parseTime(this.listQuery.endTime);
      }
      if (this.listQuery.disposeStartTime) {
        this.listQuery.disposeStartTime = parseTime(this.listQuery.disposeStartTime);
      }
      if (this.listQuery.disposeEndTime) {
        this.listQuery.disposeEndTime = parseTime(this.listQuery.disposeEndTime);
      }
      getList(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    // 重置
    clear() {
      this.listQuery = {
        vin: "",
        level: "",
        disposeStatus: "",
        sort: "",
        provinceIdArray:[],
        provinceIds:'',
        id: "",
        page: 1,
        rows: 15,
        warnIsEnd: "-1",
        groupSqlValue: [],
        groupSql: "",
        warnType: [],
        cartype: [],
        startTime: null,
        endTime: null,
        disposeStartTime: null,
        disposeEndTime: null
      };
      // 清空选项
      this.$refs.singleTable.clearSelection();
    },
    fetchData() {
      this.getListData();
      // 获取所有车型
      getCarModel()
        .then(res => {
          this.carModelList = res.model;
        })
        .catch();
      // 查询所有分组
      getGroupList()
        .then(res => {
          this.groupSqlList = res.list;
        })
        .catch();
      // 查询警告项
      getWarnTypeList()
        .then(res => {
          this.warnTypeList = res.list;
        })
        .catch();
      // 查询省份
      getProvinceAll()
        .then(res => {
          this.provinceList = res.provinceList;
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
      this.getListData();
    },
    prevClick() {
      this.listQuery.page--;
      this.getListData();
    },
    nextClick() {
      this.listQuery.page++;
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
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px !important;
}
</style>
