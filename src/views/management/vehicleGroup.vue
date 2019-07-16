<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
        <el-form-item v-if="listQuery.group" label="车组名称">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.group.groupName" placeholder="请输入车组名称" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item v-if="listQuery.group" label="车辆状态">
          <el-select @keyup.enter.native="getListData" v-model="listQuery.group.isDel" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="无效" :value="0"/>
            <el-option label="有效" :value="1"/>
          </el-select>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button v-show="isRole('/vehicleGroup/query')" type="primary" size="small"  @click="getListData">查询</el-button>
            <el-button type="primary" size="small"  @click="clear">重置</el-button>
            <el-button v-show="isRole('/vehicleGroup/add')" type="primary" size="small"  @click="edit('新增')">新增</el-button>
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
      max-height="652"
      highlight-current-row
      style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.pageIndex-1)*listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车组名称"  align="center">
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="车组状态" align="center">
        <template slot-scope="scope">
          {{ isDel(scope.row.isDel) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/vehicleGroup/update')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
              <el-button v-show="isRole('/vehicleGroup/getGroupVehicle')" circle type="primary" size="mini"  @click="memberDistribute(scope.row,'车辆分配')">车辆分配</el-button>
              <el-button v-show="isRole('/vehicleGroup/addVehicleGroupUser')" circle type="primary" size="mini"  @click="memberDistribute(scope.row,'成员分配')">成员分配</el-button>
            <el-tooltip v-show="isRole('/vehicleGroup/delete')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" size="small" @close="cancel" width="30%" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="车组名称" prop="groupName">
          <el-input type="text" v-model="addFormQuery.groupName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车组状态" prop="isDel">
          <el-select v-model="addFormQuery.isDel" placeholder="请选择">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="无效" value="0"></el-option>
            <el-option label="有效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input type="textarea" v-model="addFormQuery.remark" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改结束 -->
    <!-- 成员分配开始 -->
    <el-dialog :title="title" @close="cancel" width="600px" :visible.sync="dialogTableVisible2">
      <div class="member-wrapper">
        <div class="member-inner-wrapper">
          <el-transfer
            filterable
            :titles="['未分配人员','已分配人员']"
            :props="{
              key: 'userId',
              label: 'username'
            }"
            :filter-method="filterMember"
            filter-placeholder="请输入"
            @change="handleChange"
            v-model="userGroup"
            :data="noUserGroup">
          </el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 成员分配结束 -->
    <!-- 车辆分配开始 -->
    <el-dialog :title="title" @close="cancel" width="1000px" :visible.sync="dialogTableVisible3">
      <div class="member-wrapper">
        <div class="member-inner-wrapper">
          <el-transfer
            filterable
            :titles="['未分配车辆','已分配车辆']"
            :props="{
              key: 'id',
              label: 'vinNumLicence'
            }"
            :filter-method="filterCar"
            filter-placeholder="请输入"
            @change="handleChange"
            v-model="carGroup"
            :data="noCarGroup">
          </el-transfer>
          <div class="page-wrapper">
            <div class="page-item">
              <el-pagination
                @current-change="noCarCurrentChange"
                @prev-click="noCarPrevClick"
                @next-click="noCarNextClick"
                small
                :total="noCarTotal"
                layout="prev, pager, next">
              </el-pagination>
            </div>
            <div class="page-item">
              <el-pagination
                @current-change="carCurrentChange"
                @prev-click="carPrevClick"
                @next-click="carNextClick"
                small
                :total="carTotal"
                layout="prev, pager, next">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small"  @click="put">导入车辆</el-button>
        <el-button type="primary" size="small"  @click="download">导入模板下载</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 车辆分配结束 -->
    <!-- 导入开始 -->
    <el-dialog title="导入" width="800px" top="50px" @close="putDialogTableVisible=false" :visible.sync="putDialogTableVisible">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" border highlight-current-row :max-height="300" style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putDialogTableVisible=false">取 消</el-button>
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
import {
  uploadVehicleGroup,
  getGroupVehicle,
  getNoGroupVehicle,
  removeGroupUser,
  removeGroupVehicle,
  addGroupVehicle,
  addVehicleGroupUser,
  getUserGroupByGid,
  getNoGroupUser,
  addVehicleGroup,
  editVehicleGroup,
  getVehicleGroup,
  deleteVehicleGroup
} from "@/api/management";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { role } from "@/utils";

export default {
  name: 'vehicleGroup',
  components: { UploadExcelComponent },
  data() {
    return {
      errExcelPath:'',
      header: ["VIN"],
      tableData: [],
      tableHeader: [],
      uploadFile: {},
      memberFormQuery: {
        pageIndex: 1,
        pageSize: 500,
        groupId: ""
      },
      noCarQuery: {
        pageIndex: 1,
        pageSize: 15,
        groupId: ""
      },
      carQuery: {
        pageIndex: 1,
        pageSize: 15,
        groupId: ""
      },
      userGroup: [],
      noUserGroup: [],
      carGroup: [],
      noCarGroup: [],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      putDialogTableVisible: false,
      warnTypeList: [],
      filterMember(query, item) {
        if (item.username) return item.username.indexOf(query) > -1;
        else if (item.mobile) return item.mobile.indexOf(query) > -1;
      },
      filterCar(query, item) {
        if (item.vinNum) return item.vinNum.indexOf(query) > -1;
      },
      addFormQuery: {
        groupName: "",
        isDel: "-1",
        remark: ""
      },
      addRules: {
        groupName: {
          required: true,
          message: "请输入车组名称",
          trigger: "blur"
        },
        isDel: {
          required: true,
          message: "请选择车组状态",
          trigger: "change"
        },
        remark: {
          required: true,
          message: "请输入备注",
          trigger: "blur"
        }
      },
      listQuery: {
        group: { groupName: "", isDel: -1 },
        pageIndex: 1,
        pageSize: 15
      },
      total: 0,
      noCarTotal: 0,
      carTotal: 0
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
      this.putDialogTableVisible = true;
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
      form.append("id", this.memberFormQuery.groupId);
      if (this.uploadFile.name === "") {
        this.$message({
          message: "请选择文件!",
          type: "error"
        });
      } else {
        uploadVehicleGroup(form).then(res=>{
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
    isDel(data) {
      if (data == -1) return "全部";
      else if (data == 0) return "无效";
      else if (data == 1) return "有效";
      else return "";
    },
    // 成员分配
    memberDistribute(data, type) {
      this.title = data.groupName;
      this.memberFormQuery.groupId = data.id;
      this.noCarQuery.groupId = data.id;
      this.carQuery.groupId = data.id;
      if (type === "成员分配") {
        this.dialogTableVisible2 = true;
        this.userGroup = [];
        this.noUserGroup = [];
        const _this = this;
        const fn = async function() {
          // 查询成员分配
          await getUserGroupByGid(_this.memberFormQuery).then(res => {
            _this.userGroup = res.pageInfo.list;
          });
          await getNoGroupUser(_this.memberFormQuery).then(res => {
            _this.noUserGroup = res.pageInfo.list;
          });
          _this.noUserGroup = [..._this.noUserGroup, ..._this.userGroup];
          let array = [];
          _this.userGroup.forEach(value => {
            array.push(value.userId);
          });
          _this.userGroup = array;
        };
        fn();
      } else {
        this.dialogTableVisible3 = true;
        const _this = this;
        this.carGroup = [];
        this.noCarGroup = [];
        const fn = async function() {
          // 查询车辆分配
          await getGroupVehicle(_this.carQuery).then(res => {
            _this.carTotal = res.pageInfo.total;
            _this.carGroup = res.pageInfo.list;
            _this.carGroup.forEach(value=>{
              value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
            })
            console.log(_this.carGroup)
          });
          await getNoGroupVehicle(_this.noCarQuery).then(res => {
            _this.noCarTotal = res.pageInfo.total;
            _this.noCarGroup = res.pageInfo.list;
            _this.noCarGroup.forEach(value=>{
              value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
            })
          });
          _this.noCarGroup = [..._this.noCarGroup, ..._this.carGroup];
          let array = [];
          _this.carGroup.forEach(value => {
            array.push(value.id);
          });
          _this.carGroup = array;
        };
        fn();
      }
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery = JSON.parse(JSON.stringify(data));
      }
    },
    handleChange(value, direction, movedKeys) {
      if (direction === "right") {
        // 添加用户
        let array = [];
        movedKeys.forEach(value => {
          let key = { userId: value, groupId: this.memberFormQuery.groupId };
          array.push(key);
        });
        addVehicleGroupUser(array).then(res => {});
      } else {
        // 移除用户
        let query = {
          userIds: movedKeys,
          groupId: this.memberFormQuery.groupId
        };
        removeGroupUser(query).then(res => {});
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.title === "新增") {
          addVehicleGroup(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editVehicleGroup(this.addFormQuery).then(res => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        }
        this.cancel();
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.dialogTableVisible2 = false;
      this.dialogTableVisible3 = false;
      this.memberFormQuery = {
        pageIndex: 1,
        pageSize: 500,
        groupId: ""
      };
      this.carQuery = {
        pageIndex: 1,
        pageSize: 15,
        groupId: ""
      };
      this.noCarQuery = {
        pageIndex: 1,
        pageSize: 15,
        groupId: ""
      };
      this.addFormQuery = {
        groupName: "",
        isDel: "-1",
        remark: ""
      };
    },
    clear() {
      this.listQuery = {
        group: { groupName: "", isDel: -1 },
        pageIndex: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该车组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteVehicleGroup({ id: data.id }).then(res => {
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
      getVehicleGroup(this.listQuery).then(response => {
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
    carCurrentChange(val) {
      this.carQuery.pageIndex = val;
      getGroupVehicle(this.carQuery).then(res => {
        this.carTotal = res.pageInfo.total;
        this.carGroup = res.pageInfo.list;
        this.carGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
    },
    noCarCurrentChange(val) {
      this.noCarQuery.pageIndex = val;
      getNoGroupVehicle(this.noCarQuery).then(res => {
        this.noCarTotal = res.pageInfo.total;
        this.noCarGroup = res.pageInfo.list;
        this.noCarGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
    },
    carPrevClick(val) {
      this.carQuery.pageIndex--;
      getGroupVehicle(this.carQuery).then(res => {
        this.carTotal = res.pageInfo.total;
        this.carGroup = res.pageInfo.list;
        this.carGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
    },
    noCarPrevClick(val) {
      this.noCarQuery.pageIndex--;
      getNoGroupVehicle(this.noCarQuery).then(res => {
        this.noCarTotal = res.pageInfo.total;
        this.noCarGroup = res.pageInfo.list;
        this.noCarGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
    },
    carNextClick(val) {
      this.carQuery.pageIndex++;
      getGroupVehicle(this.carQuery).then(res => {
        this.carTotal = res.pageInfo.total;
        this.carGroup = res.pageInfo.list;
        this.carGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
    },
    noCarNextClick(val) {
      this.noCarQuery.pageIndex++;
      getNoGroupVehicle(this.noCarQuery).then(res => {
        this.noCarTotal = res.pageInfo.total;
        this.noCarGroup = res.pageInfo.list;
        this.noCarGroup.forEach(value=>{
          value.vinNumLicence = value.vinNum +' '+(value.licenc?value.licenc:'')
        })
      });
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
.member-inner-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}
.member-wrapper {
  display: flex;
  align-content: center;
  justify-content: space-around;
}
.page-wrapper {
  display: flex;
  align-content: center;
  justify-content: space-between;
}
.page-item {
  display: flex;
  align-content: center;
  justify-content: center;
  width: 432px;
}
</style>
<style>
.el-transfer-panel{
  width:432px !important;
}
</style>