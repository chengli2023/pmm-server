<template>
  <el-row>
    <el-col :span="12">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/projectList' }">项目&需求</el-breadcrumb-item>
        <el-breadcrumb-item>排期</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="12" style="text-align: right">
      <el-button type="primary" @click="openCreateDialog">创建排期</el-button>
    </el-col>
  </el-row>

  <el-card class="project-card">
    <el-row>
      <el-col :span="24" style="text-align: left;margin-bottom: 10px">
        需求/项目名称：<u>{{projectObj.projectName}}</u>
      </el-col>
    </el-row>
    <el-row style="text-align: left">
      <el-col :span="4">
        提出人：<u>{{projectObj.proposer}}</u>
      </el-col>
      <el-col :span="4">
        产品经理：<u>{{projectObj.pd}}</u>
      </el-col>
      <el-col :span="4">
        验收人：<u>{{projectObj.checker}}</u>
      </el-col>
      <el-col :span="4">
        项目对接人：<u>{{projectObj.pm}}</u>
      </el-col>
      <el-col :span="4">
        状态：<u>{{projectObj.status}}</u>
      </el-col>
    </el-row>
  </el-card>
<!--  <el-card class="plan-card">-->
  <el-table :data="projectPlanList" style="width: 100%">
    <el-table-column fixed prop="bu" label="业务中心"/>
    <el-table-column prop="developer" label="开发/测试人员"  />

    <el-table-column prop="dependTask" label="依赖/被依赖事项">
      <template v-slot="scope">
        <p v-html='scope.row.dependTask'></p>
      </template>
    </el-table-column>
    <el-table-column prop="workHour" label="工时" >
      <template v-slot="scope">
        <p v-html='scope.row.workHour'></p>
      </template>
    </el-table-column>
    <el-table-column prop="plan" label="排期" >
      <template v-slot="scope">
        <p v-html='scope.row.plan'></p>
      </template>
    </el-table-column>
    <el-table-column prop="releaseOrder" label="发布顺序" >
      <template v-slot="scope">
        <p v-html='scope.row.releaseOrder'></p>
      </template>
    </el-table-column>
    <el-table-column prop="comments" label="进展/风险备注">
      <template v-slot="scope">
        <p v-html='scope.row.comments'></p>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button type="primary" plain  size="small" @click="()=>{editProjectPlan(scope.row.id)}">编辑</el-button>
        <el-popconfirm title="Are you sure to delete this?" @confirm="()=>{deleteProjectPlan(scope.row.id)}">
          <template  #reference>
            <el-button type="danger" plain  size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
<!--  </el-card>-->
  <el-row>
    <el-col :span="24">
    </el-col>
  </el-row>
  <el-dialog v-if="dialogFormVisible" v-model="dialogFormVisible" title="需求排期" :close-on-click-modal="false" :close-on-press-escape="false" top="5vh">
    <el-form>
      <el-form-item label="业务团队" :label-width="formLabelWidth">
        <el-input v-model="projectPlanForm.bu" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="开发/测试人员" :label-width="formLabelWidth">
        <el-input v-model="projectPlanForm.developer" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="依赖/被依赖事项" :label-width="formLabelWidth">
        <QuillEditor :toolbar="vueQuillToolbarOptions" class="ql-toolbar-custom" theme="snow" @ready="((quill)=>{})" content-type="html" v-model:content="projectPlanForm.dependTask" style="height: 100px;width:100%"/>
<!--        <el-input v-model="projectPlanForm.dependTask" autocomplete="off" :rows="3" type="textarea" />-->
      </el-form-item>
      <el-form-item label="工时" :label-width="formLabelWidth">
        <QuillEditor :toolbar="vueQuillToolbarOptions" class="ql-toolbar-custom" theme="snow" content-type="html" v-model:content="projectPlanForm.workHour" style="height: 100px;width:100%"/>
      </el-form-item>
      <el-form-item label="排期" :label-width="formLabelWidth">
        <QuillEditor :toolbar="vueQuillToolbarOptions" class="ql-toolbar-custom" theme="snow" content-type="html" v-model:content="projectPlanForm.plan" style="height: 100px;width:100%"/>
      </el-form-item>

      <el-form-item label="发布顺序" :label-width="formLabelWidth">
        <QuillEditor :toolbar="vueQuillToolbarOptions" class="ql-toolbar-custom" theme="snow" content-type="html" v-model:content="projectPlanForm.releaseOrder" style="height: 100px;width:100%"/>
      </el-form-item>

      <el-form-item label="进展/风险备注" :label-width="formLabelWidth">
        <QuillEditor :toolbar="vueQuillToolbarOptions" class="ql-toolbar-custom" theme="snow" content-type="html" v-model:content="projectPlanForm.comments" style="height: 100px;width:100%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createProjectPlan">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/* eslint-disable */
import { ArrowRight } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios'
import {onMounted, reactive, ref,shallowReactive} from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const vueQuillToolbarOptions = [
  ['bold', 'strike','link',{ 'color': [] },{ 'list': 'ordered'}, { 'list': 'bullet' }] // toggled buttons
  // ['italic', 'underline',{ 'color': [] }],// dropdown with defaults from theme
  // [{ 'list': 'ordered'}, { 'list': 'bullet' }] // remove formatting button
]
const route = useRoute()
const projectPlanList = reactive([])
const projectPlanForm = shallowReactive({
  projectId:'',
  id:'',
  bu: '',
  developer:'',
  dependTask: '',
  workHour: '',
  plan: '',
  releaseOrder: '',
  comments: ''
})
const projectObj = reactive({
  projectName: '',
  proposer: '',
  checker: '',
  pm: '',
  status: ''
})

const fetchProjectPlanList = async function (){
  console.log(route.query.id)
  projectPlanList.splice(0,projectPlanList.length)
  const result = await axios.get(`/api/project/plan/list?id=${route.query.id}`,{});
  for(let index in result.data){
    projectPlanList.push(result.data[index])
  }
  // projectList = result.data;
}
const fetchProjectById = async function (projectId){
  const result = await axios.get('/api/project/getById',{params:{
      projectId:projectId
    }});
  projectObj.projectName = result.data.projectName;
  projectObj.pd = result.data.pd;
  projectObj.proposer = result.data.proposer;
  projectObj.checker = result.data.checker;
  projectObj.pm = result.data.pm;
  projectObj.status = result.data.status;

}

const createProjectPlan = async function(){
  let res = {};
  let isEditAction = projectPlanForm.id?true:false;
  if(isEditAction){
    res = await axios.post('/api/project/editProjectPlan',projectPlanForm);
  }else {
    res = await axios.post('/api/project/createProjectPlan',projectPlanForm);
  }

  if(res.status == 200){
    ElMessage({
      message: isEditAction?'编辑成功':'创建成功',
      type: 'success',
    })
    dialogFormVisible.value = false
    fetchProjectPlanList();
  }
}
const deleteProjectPlan = async function(projectPlanId){
  console.log('asfasdf' + projectPlanId)
  const res = await axios.post('/api/project/deleteProjectPlan',{projectPlanId:projectPlanId});
  if(res.status == 200){
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    dialogFormVisible.value = false
    fetchProjectPlanList();
  }
}
const editProjectPlan = async function(projectPlanId){

  const result = await axios.get(`/api/project/getProjectPlan?id=${projectPlanId}`,{});
  console.log(result.data)
  projectPlanForm.id = result.data.id;
  projectPlanForm.bu = result.data.bu;
  projectPlanForm.developer = result.data.developer;
  projectPlanForm.dependTask = result.data.dependTask;
  projectPlanForm.workHour = result.data.workHour;
  projectPlanForm.plan = result.data.plan;
  projectPlanForm.releaseOrder = result.data.releaseOrder;
  projectPlanForm.comments = result.data.comments;

  dialogFormVisible.value = true;

}
const openCreateDialog = function (){
  projectPlanForm.id = '';
  projectPlanForm.bu = '';
  projectPlanForm.developer = '';
  projectPlanForm.dependTask = '';
  projectPlanForm.workHour = '';
  projectPlanForm.plan = '';
  projectPlanForm.releaseOrder = '';
  projectPlanForm.comments = '';
  dialogFormVisible.value = true;
}
const initFormData = function(){
  this.projectForm.projectName = '';
  this.projectForm.proposer = '';
  this.projectForm.checker = '';
  this.projectForm.pm = '';
  this.projectForm.status = '';
}
const mountedFun = function (){
  projectPlanForm.projectId = route.query.id
  fetchProjectPlanList()
  fetchProjectById(route.query.id)
}
onMounted(
    mountedFun
)

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}



.editor{
  width: 50%;
  height: 100%;
}
.project-card {
  margin: 20px 0px 20px 0px;
  width: 100%;
}
.plan-card {
  width: 100%;
}

</style>
