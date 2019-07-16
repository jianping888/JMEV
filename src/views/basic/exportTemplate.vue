<template>
  <div class="app-container">
    <el-form ref="form" size="small" :model="listQuery" label-width="80px">
      <div class="inner-wrapper">
      <el-form-item label="模板名称">
        <el-input clearable @keyup.enter.native="getListData" size="small" v-model="listQuery.templateName" placeholder="请输入" suffix-icon="el-icon-edit"/>
      </el-form-item>
      <el-button-group style="margin-left:20px;margin-bottom:20px;">
          <el-button v-show="isRole('/template/queryExportTemplate')" type="primary" size="small" @click="getListData">查询</el-button>
          <el-button type="primary" size="small" @click="clear">重置</el-button>
          <el-button v-show="isRole('/template/addExportTemplate')" type="primary" size="small" @click="edit('新增')">新增</el-button>
          <el-button type="primary" size="small" @click="dialogTableVisible_set=true">导出字段设置</el-button>
      </el-button-group>
      </div>
    </el-form>
    <div>
      <el-tag
        v-for="tag in selectbasicOptions"
        :key="tag.series"
        closable
        @close="handleClose(tag)">
        {{getKeyFromValue(tag.series)}}：{{tag.seriesVal}}
      </el-tag>
    </div>
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
      <el-table-column :show-overflow-tooltip="true" align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(listQuery.page-1)*listQuery.rows }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="模板名称"  align="center">
        <template slot-scope="scope">
          {{ scope.row.templateName }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-show="isRole('/template/updateExportTemplate')" class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size="mini" icon="el-icon-edit" @click="edit('修改',scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/template/deleteExportTemplate')" class="item" effect="dark" content="删除">
              <el-button circle type="primary" size="mini" icon="el-icon-circle-close-outline" @click="deleted(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-show="isRole('/template/deleteExportTemplate')" class="item" effect="dark" content="导出" placement="right">
              <el-button circle type="primary" size="mini" icon="el-icon-download" @click="out(scope.row)"></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改开始 -->
    <el-dialog :title="title" :close-on-click-modal="false" @close="cancel" width="500px" :visible.sync="dialogTableVisible">
      <el-form ref="addForm" :rules="addRules" :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input size="small" type="text" v-model="addFormQuery.templateName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字段筛选">
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
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="makeSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改结束 -->
    <!-- 导出字段设置开始 -->
    <el-dialog title="导出字段设置" :close-on-click-modal="false" @close="cancel" width="500px" :visible.sync="dialogTableVisible_set">
      <el-form :model="addFormQuery" class="addForm-form" auto-complete="on" label-position="right" label-width="100px">
        
        <el-form-item label="字段筛选">
          <el-cascader
            :options="optionsBasic"
            :show-all-levels="false"
            v-model="basicLabelOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="字段值设置">
          <el-input
            placeholder="请输入"
            v-model="basicValue">
          </el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible_set=false">取 消</el-button>
        <el-button type="primary" @click="makeSureSet">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导出字段设置结束 -->
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
  queryExportTemplate,
  addExportTemplate,
  updateExportTemplate,
  deleteExportTemplate,
  getTemplateSeries,
  getAllTemplateSeries,
  exportTemplateSeriesData
//   getAllResource,
//   getAllResourceByRoleId
} from "@/api/info";
import {
  getAllResource
} from "@/api/management";
import { role } from "@/utils";

export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      fetchBasicList: [],
      optionsBasic: [],
      selectbasicOptions: [],
      basicValue: "",
      basicLabelOptions: [],
      basicLabel: "",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "seriesName"
      },
      resourceList: [],
      title: "",
      listLoading: false,
      dialogTableVisible: false,
      dialogTableVisible_set: false,
      warnTypeList: [],
      addFormQuery: {
        templateName: "",
        basicSeries: [],
        remark: ""
      },
      addRules: {
        templateName: {
          required: true,
          message: "请输入模板名称",
          trigger: "blur"
        }
      },
      listQuery: {
        templateName: "",
        page: 1,
        rows: 15
      },
      total: 0,
      list: []
    };
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
        this.addFormQuery.templateName = JSON.parse(JSON.stringify(data)).templateName;
        // this.addFormQuery.remark = JSON.parse(JSON.stringify(data)).remark;
        this.addFormQuery.id = JSON.parse(JSON.stringify(data)).id;
        // getAllResourceByRoleId({ roleId: data.roleId }).then(res => {
        //   this.resourceList[0].children.forEach((value)=>{
        //     res.data.forEach((item,index,array)=>{
        //       if(value.menuId == item.menuId&&value.children&&value.children.length>0){
        //         array.splice(index,1)
        //       }
        //     })
        //   })
        //   this.$refs.tree.setCheckedNodes(res.data);
        // });
        getTemplateSeries({templateId:data.id}).then(res=>{
            // let listManage=[]
            // res.list.forEach((item,index,array)=>{
            //   listManage.push({
            //       id: item.id,
            //       seriesName: item.seriesName,
            //       series: item.series,
            //       parentId: item.parentId,
            //       orderNum: item.orderNum
            //   })
            // })
            this.resourceList[0].children.forEach((value)=>{
            res.list.forEach((item,index,array)=>{
              if(value.id == item.id&&value.children&&value.children.length>0){
                array.splice(index,1)
              }
            })
          })
          this.$refs.tree.setCheckedNodes(res.list);
        })
      }
    },
    handleClose(tag) {
      this.selectbasicOptions.forEach((item,index)=>{
        if(item.series==tag.series){
          this.selectbasicOptions.splice(index, 1);
        }
      })
    },
    makeSureSet(){
      this.basicLabel=this.basicLabelOptions[this.basicLabelOptions.length-1]
      if(this.selectbasicOptions.length>0){
        for(let item of this.selectbasicOptions){
          if(item.series==this.basicLabel){
            this.$message({
              type: "error",
              message: "字段存在，不能重复设置!"
            });
            return
          }
        }
      }
      if(!((this.basicValue).trim())){
        this.$message({
              type: "error",
              message: "字段值不能为空"
            });
            return
      }
      this.selectbasicOptions.push({
        series: this.basicLabel,
        seriesVal: this.basicValue
      })
    },
    //根据value查找key值
    getKeyFromValue(val){
      for(let item of this.fetchBasicList){
        if(item.series===val){
          return item.seriesName
        }
      }
    },
    makeSure(formName) {
      this.$refs[formName].validate(valid => {
        const checkData = this.$refs.tree.getCheckedNodes();
        
        checkData.forEach((value)=>{
          this.resourceList[0].children.forEach((item,index,array)=>{
            if(value.parentId == item.id){
              if(!this.addFormQuery.basicSeries.includes(item.id)){
                this.addFormQuery.basicSeries.push(item.id);
              }
            }
          })
          this.addFormQuery.basicSeries.push(value.id);
        })
        let basicSeriesList=[]
        if(this.addFormQuery.basicSeries&&this.addFormQuery.basicSeries.length>0){
          this.addFormQuery.basicSeries.forEach((item)=>{
            basicSeriesList.push({"id":item})
          })
        }
        if (valid && this.title === "新增") {
          addExportTemplate({"id":this.addFormQuery.id,"templateName": this.addFormQuery.templateName,"basicSeries":basicSeriesList}).then(res => {
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
          query.basicSeries = this.addFormQuery.basicSeries;
          updateExportTemplate({"id":this.addFormQuery.id,"templateName": this.addFormQuery.templateName,"basicSeries":basicSeriesList}).then(res => {
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
        templateName: "",
        basicSeries: [],
        remark: ""
      };
    },
    clear() {
      this.listQuery = {
        templateName: "",
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
          deleteExportTemplate({ id: data.id }).then(res => {
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
      queryExportTemplate(this.listQuery).then(response => {
        this.list = response.page.list;
        this.listLoading = false;
        this.total = response.page.total;
      });
    },
    out(data){
      // let url="/basicseries/exportTemplateSeriesData?templateId="+data.id;
      // if(this.selectbasicOptions&&this.selectbasicOptions.length>0){
      //   this.selectbasicOptions.forEach(item=>{
      //     url+="&"+item.series+"="+item.seriesVal
      //   })
      // }
      // window.location.href = url
      let obj={}
      obj.templateId=data.id;
      if(this.selectbasicOptions&&this.selectbasicOptions.length>0){
        this.selectbasicOptions.forEach(item=>{
          obj[item.series]=item.seriesVal
        })
      }
      exportTemplateSeriesData(obj).then(res=>{

      })
    },
    fetchData() {
      getAllTemplateSeries().then(res => {
        this.fetchBasicList=JSON.parse(JSON.stringify(res.list));
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
        //设置optionsBasic
        this.optionsBasic=JSON.parse(JSON.stringify(this.resourceList));
        this.setOptionsBasic(this.optionsBasic);
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
    setOptionsBasic(list){
      list.forEach(item=>{
          item.label=item.seriesName
          item.value=item.series
          if(item.children&&item.children.length>0){
              this.setOptionsBasic(item.children);
          }else{
            delete item.children
          }
        })
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
