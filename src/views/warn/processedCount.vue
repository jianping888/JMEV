<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="select-wrapper">
        <el-form-item label="VIN">
          <el-input clearable v-model="listQuery.vin" @keyup.enter.native="getListData" placeholder="请输入" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="报警等级">
          <el-select @remove-tag="listQuery.level=[]" @keyup.enter.native="getListData" v-model="listQuery.level" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option label="1级" value="1级"/>
            <el-option label="2级" value="2级"/>
            <el-option label="3级" value="3级"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警项">
          <el-select @remove-tag="listQuery.warnType=[]" @keyup.enter.native="getListData" v-model="listQuery.warnType" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option
              v-for="item in warnTypeList"
              :key="item.warnId"
              :label="item.warnTermName"
              :value="item.warnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型">
          <el-select @remove-tag="listQuery.cartype=[]" @keyup.enter.native="getListData" v-model="listQuery.cartype" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option
              v-for="item in carModelList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组">
          <el-select @remove-tag="listQuery.groupSqlValue=[]" @keyup.enter.native="getListData" v-model="listQuery.groupSqlValue" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option
              v-for="item in groupSqlList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障时间">
            <el-date-picker               
              v-model="listQuery.warnTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              :picker-options="pickerOptions1"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button v-if="isRole('/warnDispose/bar')" type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
        </el-button-group>
      </div>
    </el-form>
    <div class="chart-container">
      <chart :list="list" height="100%" width="100%"/>
    </div>
  </div>
</template>

<script>
import {
  getDetailList,
  getGroupList,
  getWarnTypeList,
  getCarModel,
  getProcessedCount
} from "@/api/warn";
import { parseTime,role } from "@/utils";
import Chart from "./components/processedCountChart";

export default {
  name:'processedCount',
  components: { Chart },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
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
      groupSqlList: [],
      carModelList: [],
      warnTypeList: [],
      listLoading: false,
      listQuery: {
        vin: "",
        level: [],
        sort: "",
        page: 1,
        rows: 15,
        groupSql: "",
        groupSqlValue: [],
        warnType: [],
        cartype: [],
        warnTime: [],
        startTime: null,
        endTime: null
      },
      //分页
      total: 0,
      PageQuery: {
        page: 1,
        limit: 15
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    // 查询
    getListData() {
      let arrayList = {};
      this.listLoading = true;
      if (this.listQuery.warnTime && this.listQuery.warnTime.length > 0) {
        this.listQuery.startTime = this.listQuery.warnTime[0];
        this.listQuery.endTime = this.listQuery.warnTime[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      this.listQuery.groupSql =
        this.listQuery.groupSqlValue.length == 0
          ? ""
          : JSON.stringify(this.listQuery);
      getProcessedCount(this.listQuery)
        .then(response => {
          this.list = response;
          this.listLoading = false;
        })
        .catch(res => {
          if (error.data.code == "10001") {
            this.listLoading = false;
            this.list = [];
          }
        });
    },
    // 重置
    clear() {
      this.listQuery = {
        vin: "",
        level: [],
        sort: "",
        page: 1,
        rows: 15,
        groupSqlValue: [],
        groupSql: "",
        warnType: [],
        cartype: [],
        warnTime: [],
        startTime: null,
        endTime: null
      };
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
      // 查询报警项
      getWarnTypeList()
        .then(res => {
          this.warnTypeList = res.list;
        })
        .catch();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
<style scoped>
.select-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 188px);
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px !important;
}
</style>
