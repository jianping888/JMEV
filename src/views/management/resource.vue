<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
        <el-form-item label="菜单ID">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.queryMenuId" placeholder="请输入" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.name" placeholder="请输入"  suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="链接">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.url" placeholder="请输入"  suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;">
            <el-button v-show="isRole('/resource/queryPageResource')" type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button v-show="isRole('/resource/addResource')" type="primary" size="small" @click="edit('新增')">新增</el-button>
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
      max-height="652"
      style="width: 100%">
      <el-table-column label="菜单ID" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.menuId }}
        </template>
      </el-table-column>
      <el-table-column label="父菜单ID" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.parentId }}
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="菜单链接" :show-overflow-tooltip="true" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column label="类型" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ type(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="排序" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/resource/updateResource')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/resource/deleteResource')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" size="small" @close="cancel" width="500px" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="菜单名称" prop="name">
          <el-input type="text" v-model="addFormQuery.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单名称" prop="parentId">
          <div v-if="title==='新增'"><span>{{addFormQuery.parentName}}</span></div>
          <div v-else><span>{{cloneParentName}}</span></div>
          <el-input size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="resourceList"
            :props="defaultProps"
            accordion
            highlight-current
            @node-click="nodeClick"
            node-key="menuId"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </el-form-item>
        <el-form-item label="菜单链接" prop="url">
          <el-input type="text" v-model="addFormQuery.url" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addFormQuery.type" placeholder="请选择">
            <el-option label="目录" :value="0"></el-option>
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="按钮" :value="2"></el-option>
          </el-select>
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
      :current-page="listQuery.pageIndex"
      :page-sizes="[15, 30, 50 , 100 , 500]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getAllResource } from "@/api/management";
import { role } from "@/utils";
import {
  addResource,
  editResource,
  getResourceList,
  deleteResource
} from "@/api/management";

export default {
  name: 'resource',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      cloneParentName: "",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      resourceList: [],
      resourceLineList: [],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        name: "",
        parentId: "",
        parentName: "",
        url: "",
        type: ""
      },
      addRules: {
        name: {
          required: true,
          message: "请输入菜单名称",
          trigger: "blur"
        },
        type: {
          required: true,
          message: "请选择类型",
          trigger: "change"
        },
        url: {
          required: true,
          message: "请输入菜单链接",
          trigger: "blur"
        }
      },
      checkedId: null,
      listQuery: {
        queryMenuId: "",
        url: "",
        name: "",
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
    nodeClick(data, checked, node) {
      this.addFormQuery.parentName = data.name;
      this.cloneParentName = data.name;
      this.addFormQuery.parentId = data.menuId;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    type(data) {
      if (data == -1) return "请选择";
      else if (data == 0) return "目录";
      else if (data == 1) return "菜单";
      else if (data == 2) return "按钮";
      else return "";
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery = JSON.parse(JSON.stringify(data));
        this.addFormQuery.parentName = "";
        this.resourceLineList.forEach(value => {
          if (value.menuId == data.parentId) {
            this.addFormQuery.parentName = value.name;
          }
        });
        this.cloneParentName = this.addFormQuery.parentName;
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        // const checkData = this.$refs.tree.getCheckedNodes();
        // checkData.forEach(value => {
        //   this.addFormQuery.menuIds.push(value.menuId);
        // });
        if (
          this.addFormQuery.parentId == "" ||
          this.addFormQuery.parentId == null
        ) {
          this.$message({
            message: "请选择父级菜单名称",
            type: "error",
            duration: 5 * 1000
          });
        }
        if (valid && this.title === "新增") {
          addResource(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getListData();
          });
        } else if (valid && this.title === "修改") {
          editResource(this.addFormQuery).then(res => {
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
        name: "",
        url: "",
        parentId: "",
        parentName: "",
        type: ""
      };
    },
    clear() {
      this.listQuery = {
        queryMenuId: "",
        url: "",
        name: "",
        pageIndex: 1,
        pageSize: 15
      };
    },
    deleted(data) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteResource({ id: data.menuId }).then(res => {
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
      getResourceList(this.listQuery).then(response => {
        this.list = response.pageInfo.list;
        this.listLoading = false;
        this.total = response.pageInfo.total;
      });
    },
    fetchData() {
      getAllResource().then(res => {
        this.resourceLineList = res.data;
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
