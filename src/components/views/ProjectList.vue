<template>
  <el-row>
    <el-col :span="12">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/projectList' }">项目/需求</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="12" style="text-align: right">
      <el-button type="primary" @click="openCreateDialog">创建项目</el-button>
    </el-col>
  </el-row>
<!--  <el-card class="project-card">-->
    <el-table :data="projectList" style="width: 100%">
    <el-table-column fixed prop="projectName" label="项目/需求名称"  />
    <el-table-column prop="proposer" label="提出人"  />
    <el-table-column prop="pd" label="产品经理"  />
    <el-table-column prop="checker" label="验收人" />
    <el-table-column prop="pm" label="项目经理" />
    <el-table-column prop="status" label="状态"/>
    <el-table-column fixed="right" label="操作" >
      <template #default="scope">
        <el-button  type="success" plain size="small" @click="()=>{this.$router.push({
        path:'projectPlanList',
        query:{id:scope.row.id}
        })}">计划</el-button>
        <el-button type="primary" plain size="small" @click="()=>{editProject(scope.row.id)}">编辑</el-button>
        <el-popconfirm title="Are you sure to delete this?" @confirm="()=>{deleteProject(scope.row.id)}">
          <template  #reference>
            <el-button type="danger" plain size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
    <el-dialog v-model="dialogFormVisible" title="创建/编辑项目" :close-on-click-modal="false" :close-on-press-escape="false" >
      <el-form :model="projectForm">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="projectForm.projectName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="提出人" :label-width="formLabelWidth">
          <el-input v-model="projectForm.proposer" autocomplete="off" />
        </el-form-item>
        <el-form-item label="产品经理" :label-width="formLabelWidth">
          <el-input v-model="projectForm.pd" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验收人" :label-width="formLabelWidth">
          <el-input v-model="projectForm.checker" autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目经理" :label-width="formLabelWidth">
          <el-input v-model="projectForm.pm" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-input v-model="projectForm.status" autocomplete="off" />
        </el-form-item>

  <!--      <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createProject"
          >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
<!--  </el-card>-->
</template>

<script setup>
/* eslint-disable */
import axios from 'axios'
import {onMounted, reactive, ref} from 'vue'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const projectList = reactive([])
const projectForm = reactive({
  id:'',
  projectName: '',
  pd:'',
  proposer: '',
  checker: '',
  pm: '',
  status: ''
})

const fetchProjectList = async function (){
  projectList.splice(0,projectList.length)
  const result = await axios.get('/api/project/list',{});
  for(let index in result.data){
    projectList.push(result.data[index])
  }
  // projectList = result.data;
}
const createProject = async function(){
  let res = {};
  let isEditAction = projectForm.id?true:false;
  if(isEditAction){
    res = await axios.post('/api/project/editProject',projectForm);
  }else {
    res = await axios.post('/api/project/createProject',projectForm);
  }
  if(res.status == 200){
    ElMessage({
      message:isEditAction?'编辑成功':'创建成功',
      type: 'success',
    })
    dialogFormVisible.value = false
    fetchProjectList();
  }
}
const editProject = async function(projectId){
  console.log(projectId)
  const result = await axios.get(`/api/project/getById?projectId=${projectId}`,{});
  console.log(result.data)

  projectForm.id = result.data.id;
  projectForm.projectName = result.data.projectName;
  projectForm.pd = result.data.pd;
  projectForm.proposer = result.data.proposer;
  projectForm.checker = result.data.checker;
  projectForm.pm = result.data.pm;
  projectForm.status = result.data.status;

  dialogFormVisible.value = true;
}
const openCreateDialog = function (){
  projectForm.id = '';
  projectForm.projectName = '';
  projectForm.pd = '';
  projectForm.proposer = '';
  projectForm.checker = '';
  projectForm.pm = '';
  projectForm.status = '';
  dialogFormVisible.value = true;
}
const deleteProject = async function(projectId){
  const res = await axios.post('/api/project/deleteProject',{projectId:projectId});
  if(res.status == 200){
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    dialogFormVisible.value = false
    fetchProjectList();
  }
}
const initFormData = function(){
  this.projectForm.projectName = '';
  this.projectForm.pd = '';
  this.projectForm.proposer = '';
  this.projectForm.checker = '';
  this.projectForm.pm = '';
  this.projectForm.status = '';
}
onMounted(
    fetchProjectList
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
.project-card {
  margin: 20px 0px 10px 0px;
  width: 100%;
}
</style>
