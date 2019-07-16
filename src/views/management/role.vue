<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
      <el-form-item label="角色名称">
        <el-input clearable @keyup.enter.native="getListData" size="small" v-model="listQuery.roleName" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/role/queryPageRole')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/role/addRole')" type="primary" size="small" @click="edit('新增')">新增</el-button>
      </el-button-group>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="rolesList"
      element-loading-text="Loading"
      border
      fit
      stripe
      size="mini"
      highlight-current-row
      max-height="652"
      style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="角色名称"  align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="备注"  align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/role/updateRole')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/role/deleteRole')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" @close="cancel" width="500px" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="small" type="text" v-model="addFormQuery.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-input 
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            accordion
            :data="resourceList"
            :props="defaultProps"
            show-checkbox
            highlight-current
            node-key="menuId"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" type="textarea" v-model="addFormQuery.remark" placeholder="请输入"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="makeSure('addForm')">确 定</el-button>
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
import { mapGetters } from "vuex";
import {
  getRoleList,
  addRole,
  editRole,
  deleteRole,
  getAllResource,
  getAllResourceByRoleId
} from "@/api/management";
import { role } from "@/utils";

export default {
  name: 'role',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      resourceList: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        roleName: "",
        menuIds: [],
        remark: ""
      },
      addRules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur"
        }
      },
      listQuery: {
        roleName: "",
        page: 1,
        rows: 15
      },
      total: 0
    };
  },
  computed: {
    ...mapGetters(["rolesList"])
  },
  created() {
    this.fetchData();
  },
  methods: {
    isRole(item) {
      return role(item)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery.roleName = JSON.parse(JSON.stringify(data)).roleName;
        this.addFormQuery.remark = JSON.parse(JSON.stringify(data)).remark;
        this.addFormQuery.roleId = JSON.parse(JSON.stringify(data)).roleId;
        getAllResourceByRoleId({ roleId: data.roleId }).then(res => {
          this.resourceList[0].children.forEach((value)=>{
            res.data.forEach((item,index,array)=>{
              if(value.menuId == item.menuId&&value.children&&value.children.length>0){
                array.splice(index,1)
              }
            })
          })
          this.$refs.tree.setCheckedNodes(res.data);
        });
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        const checkData = this.$refs.tree.getCheckedNodes();
        
        checkData.forEach((value)=>{
          this.resourceList[0].children.forEach((item,index,array)=>{
            if(value.parentId == item.menuId){
              if(!this.addFormQuery.menuIds.includes(item.menuId)){
                this.addFormQuery.menuIds.push(item.menuId);
              }
            }
          })
          this.addFormQuery.menuIds.push(value.menuId);
        })
        if (valid && this.title === "新增") {
          addRole(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          let query = {};
          query.sysRole = this.addFormQuery;
          query.menuIds = this.addFormQuery.menuIds;
          editRole(query).then(res => {
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
        roleName: "",
        menuIds: [],
        remark: ""
      };
    },
    clear() {
      this.listQuery = {
        roleName: "",
        page: 1,
        rows: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole({ id: data.roleId }).then(res => {
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
      this.$store.dispatch("GetRoleList", this.listQuery).then(res => {
        this.listLoading = false;
        this.total = res.pageInfo.total;
      });
    },
    fetchData() {
      getAllResource().then(res => {
        res.data.forEach(item => {
          if (item.menuId == 71) {
            this.resourceList.push({
              name: item.name,
              url: item.url,
              type: item.type,
              orderNum: item.orderNum,
              perms: item.perms,
              menuId: item.menuId,
              parentId: item.parentId,
              children: []
            });
          }
        });
        this.loop(
          res.data,
          this.resourceList[0].children,
          this.resourceList[0].menuId
        );
      });
      this.getListData();
    },
    loop(list, data, parentId) {
      list.forEach(item => {
        if (item.parentId == parentId) {
          var child = {
            name: item.name,
            url: item.url,
            type: item.type,
            orderNum: item.orderNum,
            perms: item.perms,
            menuId: item.menuId,
            parentId: item.parentId,
            children: []
          };
          this.loop(list, child.children, item.menuId);
          data.push(child);
        }
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
