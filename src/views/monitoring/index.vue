<template>
  <div class="app-container">
    <el-form ref="form" size="small" :inline="true" :model="listQuery" label-width="80px">
      <el-form-item label="VIN">
        <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.vin" placeholder="请选择" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-form-item label="数据来源">
        <el-select @keyup.enter.native="getListData" v-model="listQuery.collection" placeholder="请选择">
          <el-option label="采集器" value="local"/>
          <el-option label="北理平台" value="jmevTest"/>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
          <el-date-picker
            size="small"
            v-model="timeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期">
          </el-date-picker>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :cell-style="cellStyle"
      border
      fit
      size="mini"
      stripe
      highlight-current-row
      max-height="652"
      style="width: 100%">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="VIN" width="180" align="center">
        <template slot-scope="scope">
          {{ listQuery.vin }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="报文时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.time1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="报警等级" align="center">
        <template slot-scope="scope">
          {{scope.row.e1}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="报警内容" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.e2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车辆状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.a1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="充电状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.a2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="运行模式" align="center">
        <template slot-scope="scope">
          {{ scope.row.a3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车速" align="center">
        <template slot-scope="scope">
          {{ scope.row.a4 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="累计里程" align="center">
        <template slot-scope="scope">
          {{ scope.row.a5 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="总电压" align="center">
        <template slot-scope="scope">
          {{ scope.row.a6 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="总电流" align="center">
        <template slot-scope="scope">
          {{ scope.row.a7 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="SOC" align="center">
        <template slot-scope="scope">
          {{ scope.row.a8 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="DC/DC状态" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.a9 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="档位" align="center">
        <template slot-scope="scope">
          {{ scope.row.aa }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="绝缘电阻" align="center">
        <template slot-scope="scope">
          {{ scope.row.ab }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="加速踏板行程" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.ac }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="制动踏板状态" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.ad }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机个数" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机序号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机状态" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机控制器温度" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.b4 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机转速" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b5 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机转矩" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b6 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="驱动电机温度" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.b7 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电机控制器输入电压" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.b8 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电机控制器直流母线电流" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.b9 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="定位状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.c1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="经度" align="center">
        <template slot-scope="scope">
          {{ scope.row.c2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="纬度" align="center">
        <template slot-scope="scope">
          {{ scope.row.c3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高电压电池子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高电压电池单体代号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池单体最高电压值" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最低电压电池子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d4 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最低电压电池单体代号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d5 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="电池单体最低电压值" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d6 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高温度子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d7 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高温度探针序号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d8 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高温度值" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.d9 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最低温度子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.da }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最低温度探针序号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.db }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最低温度值" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.dc }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="最高报警等级" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.e1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="通用报警标记" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.e2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能子系统个数" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能装置电压" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能装置电流" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f4 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="单体电池总数" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.f5 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="本帧起始电池序号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f6 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="本帧起始电池总数" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f7 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="单体电池电压" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.f8 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能子系统个数" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.g1 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能子系统号" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.g2 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能温度探针个数" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.g3 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="可充电储能子系统各温度" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.g4 }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="GSM天线故障" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.g5 }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      prev-text="上一页"
      next-text="下一页"
      :current-page="listQuery.page"
      :page-sizes="[20, 30, 50 , 100 , 500]"
      :page-size="listQuery.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getMonitoringList } from "@/api/monitoring";
import {parseTime} from '@/utils'

export default {
  name: 'monitoring',
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
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      timeValue:[],
      warnTypeList: [],
      listQuery: {
        vin:'',
        collection:'local',
        startTime:'',
        endTime:'',
        page:1,
        rows:20
      },
      total: 0
    };
  },
  created() {
    this.listQuery.vin = this.$route.query.vin;
    this.fetchData();
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}){
      if(rowIndex == 6){
        return {width:600}
      }
    },
    onlineSign(data){
      if (data== -1) return '全部'
      else if(data == 1) return 'VIN'
      else if(data == 2) return 'SN号'
      else if(data == 3) return '其他'
      else return ''
    },
    isLease(data){
      if (data== -1) return '全部'
      else if(data == 1) return '是'
      else if(data == 0) return '否'
      else return ''
    },
    isImport(data){
      if (data== -1) return '全部'
      else if(data == 1) return '是'
      else if(data == 0) return '否'
      else return ''
    },
    clear() {
      this.timeValue = [],
      this.listQuery = {
        vin:'',
        collection:'local',
        startTime:'',
        endTime:'',
        page:1,
        rows:20
      };
    },
    getListData() {
      this.listLoading = true;
      if(this.timeValue&&this.timeValue.length>0){
        this.listQuery.startTime = new Date(this.timeValue[0]).getTime()
        this.listQuery.endTime = new Date(this.timeValue[1]).getTime()
      }else{
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      getMonitoringList(this.listQuery).then(response => {
        this.list = response.content;
        this.listLoading = false;
        this.total = response.totalElements;
      });
    },
    fetchData() {
      this.getListData();
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
.inner-wrapper {
  display: flex;
}
.pickerTime{
  align-items: center;
  display: flex;
  margin: 20px 0;
}
.title{
  margin-right: 20px;
}
.maxWidth{
  lines:1;
  word-wrap: none;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
}
</style>
