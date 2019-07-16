<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="100px">
      <div class="select-wrapper">
        <el-form-item label="报警等级">
          <el-select @remove-tag="listQuery.level=[]"  @keyup.enter.native="getListData" v-model="listQuery.level" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option label="1级" value="1级"/>
            <el-option label="2级" value="2级"/>
            <el-option label="3级" value="3级"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警项">
          <el-select @keyup.enter.native="getListData" @remove-tag="listQuery.warnT=[]" v-model="listQuery.warnT" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option
              v-for="item in warnTypeList"
              :key="item.warnTermName"
              :label="item.warnTermName"
              :value="item.warnTermName">
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
        <el-form-item label="分组">
          <el-select @keyup.enter.native="getListData" @remove-tag="listQuery.groupSqlValue=[]" v-model="listQuery.groupSqlValue" collapse-tags clearable multiple filterable placeholder="请选择">
            <el-option
              v-for="item in groupSqlList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="select-wrapper">
        <el-form-item label="故障时间">
            <el-date-picker               
              size="small"
              v-model="listQuery.warnTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              :picker-options="pickerOptions1"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/warntable/query')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button type="primary" size="small" @click="out">导出</el-button>
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
      :span-method="objectSpanMethod"
      :max-height="maxHeight"
      style="width: 100%">
      <el-table-column
        align="center"
        fixed
        prop="type"
        label="故障类型"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        fixed
        prop="lv"
        label="故障等级"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        v-for="(item,index) in carModelList"
        :key="index"
        width="120"
        :prop="item"
        :label="item">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getDetailList,
  getGroupList,
  getWarnTypeList,
  getCarModel
} from "@/api/warn";
import { parseTime,role } from "@/utils";

export default {
  name: 'warnList',
  data() {
    return {
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
      list: [],
      groupSqlList: [],
      carModelList: [],
      warnTypeList: [],
      listLoading: false,
      listQuery: {
        level: [],
        groupSql: "",
        groupSqlValue: [],
        warnT: [],
        cartype: [],
        warnTime: [],
        startTime: null,
        endTime: null
      },
      total: 0
    };
  },
  mounted() {
    this.maxHeight = `${document.documentElement.clientHeight}` - 24 - 188;
    this.fetchData();
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    // 查询
    getListData() {
      this.list = [];
      if (this.listQuery.warnTime && this.listQuery.warnTime.length > 0) {
        this.listQuery.startTime = this.listQuery.warnTime[0];
        this.listQuery.endTime = this.listQuery.warnTime[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      let arrayList = {};
      this.listLoading = true;
      this.listQuery.groupSql =
        this.listQuery.groupSqlValue.length == 0
          ? ""
          : JSON.stringify(this.listQuery);
      getDetailList(this.listQuery)
        .then(response => {
          for (var type in response.data) {
            response.data[type]["合计"] = {};
            for (var lv in response.data[type]) {
              if (response.data[type][lv] == null) {
                delete response.data[type][lv];
              } else {
                arrayList = { lv: lv, type: type };
                this.carModelList.forEach((value, index, array) => {
                  for (var item in response.data[type][lv]) {
                    arrayList["" + item + ""] = response.data[type][lv][item];
                  }
                });
                this.list.push(arrayList);
              }
            }
          }
          this.list.forEach((value, index, array) => {
            let myValue = value;
            let myIndex = index;
            let myArray = array;
            if (myIndex % 4 == 3) {
              this.carModelList.forEach((value, index, array) => {
                let preValue = myArray[myIndex - 1]["" + value + ""]
                  ? myArray[myIndex - 1]["" + value + ""]
                  : 0;
                let prepreValue = myArray[myIndex - 2]["" + value + ""]
                  ? myArray[myIndex - 2]["" + value + ""]
                  : 0;
                let preprepreValue = myArray[myIndex - 3]["" + value + ""]
                  ? myArray[myIndex - 3]["" + value + ""]
                  : 0;
                myValue["" + value + ""] =
                  preValue + prepreValue + preprepreValue == 0
                    ? null
                    : preValue + prepreValue + preprepreValue;
              });
            }
          });
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
        level: [],
        groupSql: "",
        groupSqlValue: [],
        warnT: [],
        cartype: [],
        warnTime: [],
        startTime: null,
        endTime: null
      };
    },
    fetchData() {
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
      this.getListData();
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
    },
    //导出
    out() {
      if (this.listQuery.warnTime && this.listQuery.warnTime.length > 0) {
        this.listQuery.startTime = this.listQuery.warnTime[0];
        this.listQuery.endTime = this.listQuery.warnTime[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      const query =
        (this.listQuery.startTime == null
          ? ""
          : "&startTime=" + parseTime(this.listQuery.startTime)) +
        (this.listQuery.endTime == null
          ? ""
          : "&endTime=" + parseTime(this.listQuery.endTime));
      window.location.href =
        "/warntable/export?warnT=" +
        this.listQuery.warnT +
        "&cartype=" +
        this.listQuery.cartype +
        "&level=" +
        this.listQuery.level +
        query;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
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
