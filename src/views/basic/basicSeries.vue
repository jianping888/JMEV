<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
        <el-form-item label="字段名称">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.seriesName" placeholder="请输入" suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="字段">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.series" placeholder="请输入"  suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="父节点名称" label-width="120px">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.parentName" placeholder="请输入"  suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-form-item label="父节点（表）" label-width="120px">
          <el-input clearable @keyup.enter.native="getListData" v-model="listQuery.parent" placeholder="请输入"  suffix-icon="el-icon-edit"/>
        </el-form-item>
        <el-button-group style="margin-left:20px;margin-bottom:20px;min-width:200px;">
            <el-button v-show="isRole('/basicseries/queryBasicSeries')" type="primary" size="small" @click="getListData">查询</el-button>
            <el-button type="primary" size="small" @click="clear">重置</el-button>
            <el-button v-show="isRole('/basicseries/addBasicSeries')" type="primary" size="small" @click="edit('新增')">新增</el-button>
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
      <el-table-column label="字段名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.seriesName }}
        </template>
      </el-table-column>
      <el-table-column label="字段" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.series }}
        </template>
      </el-table-column>
      <el-table-column label="父节点名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ nameFromId(scope.row.parentId) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="orderNum" :show-overflow-tooltip="true" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column> -->
      <el-table-column label="更新时间" :show-overflow-tooltip="true"  align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/basicseries/updateBasicSeries')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/basicseries/deleteBasicSeries')" class="item" effect="dark" content="删除" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" :close-on-click-modal="false" size="small" @close="cancel" width="500px" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="字段名称" prop="seriesName">
          <el-input type="text" v-model="addFormQuery.seriesName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字段" prop="series">
          <el-input type="text" v-model="addFormQuery.series" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父节点ID">
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
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addFormQuery.seriesType" placeholder="请选择">
            <el-option label="目录" :value="'0'"></el-option>
            <el-option label="表单" :value="'2'"></el-option>
            <el-option label="字段" :value="'1'"></el-option>
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
  queryBasicSeries,
  updateBasicSeries,
  addBasicSeries,
  deleteBasicSeries,
  getAllTemplateSeries
} from "@/api/info";

export default {
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
        label: "seriesName"
      },
      resourceList: [],
      resourceLineList: [],
      list: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      warnTypeList: [],
      addFormQuery: {
        seriesName: "",
        series: "",
        parentId: "",
        orderNum: 1,
        parentName: "",
        seriesType: ""
      },
      addRules: {
        seriesName: {
          required: true,
          message: "请输入字段名称",
          trigger: "blur"
        },
        series: {
          required: true,
          message: "请输入字段",
          trigger: "blur"
        }
      },
      checkedId: null,
      listQuery: {
        seriesName: "",
        series: "",
        parent: "",
        parentName: "",
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
      if(data.seriesType==1){
        this.$message({
            message: "父级节点不能选择字段",
            type: "error",
            duration: 3000
        });
        return
      }
      this.addFormQuery.parentName = data.seriesName;
      this.cloneParentName = data.seriesName;
      this.addFormQuery.parentId = data.id;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.seriesName.indexOf(value) !== -1;
    },
    type(data) {
      if (data == -1) return "请选择";
      else if (data == 0) return "目录";
      else if (data == 1) return "菜单";
      else if (data == 2) return "按钮";
      else return "";
    },
    nameFromId(id){
      if(this.resourceLineList.length>0){
         for(let item of this.resourceLineList){
           if(item.id==id){
              return item.seriesName
           }
         }
      }
    },
    edit(type, data) {
      this.title = type;
      this.dialogTableVisible = true;
      if (type === "修改") {
        this.addFormQuery = JSON.parse(JSON.stringify(data));
        this.addFormQuery.parentName = "";
        this.resourceLineList.forEach(value => {
          if (value.id == data.parentId) {
            this.addFormQuery.parentName = value.seriesName;
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
        if(this.filterText==0&&this.resourceList.length<1){
          this.addFormQuery.parentId = '0'
        }
        if (
          this.addFormQuery.parentId == "" ||
          this.addFormQuery.parentId == null
        ) {
          this.$message({
            message: "请选择父级菜单名称",
            type: "error",
            duration: 5 * 1000
          });
          return
        }
        this.addFormQuery.orderNum=this.setOrderNum(this.addFormQuery.parentId);
        if (valid && this.title === "新增") {
          addBasicSeries(this.addFormQuery).then(res => {
            this.$message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            });
            this.fetchData();
          });
        } else if (valid && this.title === "修改") {
          updateBasicSeries(this.addFormQuery).then(res => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            });
            this.fetchData();
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
        seriesName: "",
        series: "",
        parentId: "",
        orderNum: 1,
        parentName: "",
        seriesType:""
      };
    },
    clear() {
      this.listQuery = {
        seriesName: "",
        series: "",
        parent: "",
        parentName: "",
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
          deleteBasicSeries({ id: data.id }).then(res => {
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
      queryBasicSeries(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    fetchData() {
      this.resourceLineList=[]
      this.resourceList=[]
      getAllTemplateSeries().then(res => {
        this.resourceLineList = res.list;
        res.list.forEach(item => {
          if (item.parentId == 0) {
            this.resourceList.push({
              seriesName: item.seriesName,
              series: item.series,
              seriesType: item.seriesType,
              orderNum: item.orderNum,
              id: item.id,
              parentId: item.parentId,
              children: []
            });
          }
        });
        this.loop(
          res.list,
          this.resourceList[0].children,
          this.resourceList[0].id
        );
      });

      this.getListData();
    },
    loop(list, data, parentId) {
      list.forEach(item => {
        if (item.parentId == parentId) {
          var child = {
              seriesName: item.seriesName,
              series: item.series,
              seriesType: item.seriesType,
              orderNum: item.orderNum,
              id: item.id,
              parentId: item.parentId,
              children: []
          };
          this.loop(list, child.children, item.id);
          data.push(child);
        }
      });
    },
    //根据parentId查询并设置orderNum
    setOrderNum(parentId){
      let arr=this.list.filter( (value,index) => value.parentId==parentId);
      if(arr.length==0){
        return 1;
      }
      let arrOrderNum=[]
      for(let item of arr){
        if(item.orderNum){
          arrOrderNum.push(parseInt(item.orderNum))
        }
      }
      if(arrOrderNum.length==0){
        return 1;
      }
      var max=Math.max.apply(Math,arrOrderNum);
      return max+1;
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
