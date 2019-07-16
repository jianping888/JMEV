<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px" label-position="right">
      <div class="inner-wrapper">
        <el-form-item label="通知策略">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.name" placeholder="请输入通知策略" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button type="primary" size="small" @click="edit('新增')">新增</el-button>
        </el-button-group>
      </div>
    </el-form>
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
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column label="通知策略" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="适用故障等级"  align="center">
        <template slot-scope="scope">
          {{ scope.row.warnLevelString }}
        </template>
      </el-table-column>
      <el-table-column label="是否生效"  align="center">
        <template slot-scope="scope">
          {{ scope.row.statusString }}
        </template>
      </el-table-column>
      <el-table-column label="发送对象" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.recipient }}
        </template>
      </el-table-column>
      <el-table-column label="抄送对象" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.pushUser }}
        </template>
      </el-table-column>
      <el-table-column label="入库时间" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
              <el-button size="mini" circle type="primary" icon="el-icon-edit" @click="edit('修改', scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
              <el-button size="mini" circle type="primary" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog @close="cancel" width="700px" :title="title" top="0" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" size="small"  :rules="addRules" label-width="120px" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right">
        <el-form-item label="通知策略" prop="name">
          <el-input type="text" v-model="addFormQuery.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="故障等级" prop="warnLevel">
          <el-select v-model="addFormQuery.warnLevel" placeholder="请选择">
            <el-option label="所有等级" :value="0"></el-option>
            <el-option label="3级" :value="3"></el-option>
            <el-option label="2级" :value="2"></el-option>
            <el-option label="1级" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略状态">
          <el-radio-group v-model="addFormQuery.status">
            <el-radio :label="1">生效</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知方式">
          <el-radio-group v-model="addFormQuery.noticeType">
            <el-radio :label="1">短信</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">紧急告警短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送对象" prop="recipient">
          <el-input @keyup.enter.native="makeSure('addForm')" type="textarea" v-model="addFormQuery.recipient" placeholder="请输入发送对象"></el-input>
          <span>邮箱或电话之间，用,分隔。</span>
        </el-form-item>
        <el-form-item label="抄送对象">
          <el-transfer filterable filter-placeholder="请输入查找对象" :titles="['用户列表', '抄送对象']" v-model="addFormQuery.userIds" :data="addLeftUserList"></el-transfer>
        </el-form-item>
        <el-form-item v-if="addFormQuery.noticeType==2" label="其他抄送对象">
          <el-input type="textarea" v-model="addFormQuery.otherUsers" placeholder="请输入其他抄送对象"></el-input>
          <span>邮箱或电话之间，用,分隔。</span>
        </el-form-item>
        <el-form-item v-if="addFormQuery.noticeType==2" label="有效时段">
          <el-radio-group v-model="addFormQuery.timeInterval">
            <el-radio :label="0">所有时段</el-radio>
            <el-radio :label="1">周一至周五</el-radio>
            <el-radio :label="2">周一至周六</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="addFormQuery.noticeType==2" label="有效时段">
          <el-select v-model="addFormQuery.sendHour">
            <el-option v-for="(item,index) in 24" :key="index" :label="item+'时'" :value="item"></el-option>
          </el-select>
          <el-select v-model="addFormQuery.sendMin">
            <el-option v-for="(item,index) in [10,20,30,40,50,60]" :key="index" :label="item+'分'" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略描述">
          <el-input type="textarea" v-model="addFormQuery.detail" placeholder="请输入其他抄送对象"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改结束 -->
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
import { getNoticeList, addNotice, editNotice, deleteNotice } from "@/api/warn";
import { getUserlist } from "@/api/user";
import { role } from "@/utils";

export default {
  name: 'warnNotice',
  data() {
    return {
      maxHeight:652,
      addLeftUserList: [],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      listLoading: false,
      addFormQuery: {
        detail: "",
        name: "",
        sendMail:'jmev-icv-op1@jmev.com',
        sendHour: 0,
        sendMin: 0,
        userIds: [],
        timeInterval: 0,
        warnLevel: 0,
        noticeType: 2,
        status: 1,
        otherUsers: "",
        recipient: "",
      },
      addRules: {
        name: {
          required: true,
          message: "请输入报警项名称",
          trigger: "blur"
        },
        recipient: {
          required: true,
          message: "请输入发送对象",
          trigger: "blur"
        },
        warnLevel: {
          required: true,
          message: "请选择故障等级"
        },
      },
      listQuery: {
        name: "",
        page: 1,
        rows: 15
      },
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  mounted(){
    this.maxHeight = `${document.documentElement.clientHeight}` - 128 - 188;
  },
  methods: {
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if(this.addLeftUserList.length==0){
        // 获取用户列表
        getUserlist().then(res => {
          res.userList.forEach((value, index, array) => {
            this.addLeftUserList.push({ label: value.username, key: value.userId });
          });
        });
      }
      if (type === "修改") {
        data.userIds = [];
        data.users.forEach(value => {
          data.userIds.push(value.userId);
        });
        this.addFormQuery = JSON.parse(JSON.stringify(data));
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        let query = this.addFormQuery;
        let userIdString = "";
        this.addFormQuery.userIds.forEach((value, index, array) => {
          userIdString += value + ",";
        });
        query.userIds = userIdString;
        if (valid && this.title === "新增") {
          
          addNotice(query).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editNotice(query).then(res => {
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
        this.clear();
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.clear();
    },
    clear() {
      this.listQuery = {
        name: "",
        page: 1,
        rows: 15
      };
      this.addFormQuery = {
        detail: "",
        sendHour: 0,
        sendMin: 0,
        userIds: [],
        timeInterval: 0,
        name: "",
        warnLevel: 0,
        noticeType: 2,
        otherUsers: "",
        recipient: "",
        status: 1,
        sendMail:'jmev-icv-op1@jmev.com',
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNotice({ id: data.id }).then(res => {
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
    fetchData() {
      this.listLoading = true;
      this.getListData();
    },
    getListData(){
      getNoticeList(this.listQuery).then(response => {
        this.list = response.page.list;
        this.total = response.page.total;
        this.listLoading = false;
      });
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
</style>

