<template>
  <div class="app-container textcenter">
    <!-- 导入开始 -->
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row :max-height="300" style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2=false;errExcelPath=''">取 消</el-button>
        <el-button type="primary" @click="UploadmakeSure()">确 定</el-button>
        <el-button type="primary" size="small" @click="download">导入模板下载</el-button>
        <el-button v-if="errExcelPath" type="primary" @click="downLog()">查询结果下载</el-button>
      </span>
    <!-- 导入结束 -->
  </div>
</template>

<script>
import axios from 'axios';
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { parseTime,role } from "@/utils";
import {
  uploadFlow
} from "@/api/info";

export default {
  name: 'flow',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      maxHeight:652,
      header: [
        "ICCID"
      ],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      dialogTableVisible2: true,
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
      dialogTableVisible: false,
      total: 0
    };
  },
  created() {
    
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
        "http://10.250.100.175:8081/export/flow.xlsx";
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
      this.errExcelPath = '';
      form.append("file", file);
      if (this.uploadFile.name === "") {
        this.$message({
          message: "请选择文件!",
          type: "error"
        });
      } else {
          var _this = this;
          axios.post('/chinamobile/getVehicleAccountGPRS', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function(response) {
            if(response.data.errExcelPath){
                _this.errExcelPath = response.data.errExcelPath;
            }
        });
        
      }
    },
    // 导出日志
    downLog(){
      window.location.href =
        "/fileController/download?filename=" +
        this.errExcelPath
    }
  }
};
</script>
<style scoped>
.textcenter {
    text-align: center
}
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
