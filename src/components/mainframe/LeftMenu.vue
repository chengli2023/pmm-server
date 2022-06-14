<template>
  <el-row>
    <el-col :span="24" style="font-size: 18px; font-weight: bolder; color: white; text-align: center; line-height: 60px; height: 60px">
      中台需求/任务排期
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="/projectList"
          text-color="#fff"
          style="border:none"
          router="true"
      >
        <el-menu-item  index="/projectList" >
          <el-icon><Document /></el-icon>
          <span>需求/项目</span>
<!--          <router-link to="/projectList" style="color: goldenrod; ">需求/项目</router-link>-->
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document
} from '@element-plus/icons-vue'
</script>

<style scoped>
/deep/ .el-submenu__title {
  width: 200px;
}

/deep/ .el-menu-item-group__title {
  width: 200px;
}
</style>

