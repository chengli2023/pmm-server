<template>
  <div class="body-bg">
    <el-container style="height:calc(100% - 0px)">
      <el-aside style="background: rgb(84, 92, 100);"  width="200px">
        <LeftMenu></LeftMenu>
        <div style="position: absolute; bottom: 0px; text-align: center; width: 200px;padding: 10px 0px 10px 0px; color:gray">版本：v0.1，2022-05</div>
      </el-aside>
<!--        <el-header style="padding:0;">
          <TopMenu></TopMenu>
        </el-header>-->
        <!--<div style="border:1px solid red;">这里是主界面</div>-->

      <el-main>
        <router-view/>
      </el-main>
      </el-container>
  </div>
</template>
<script>
export default {
  name: 'LAYOUT'
}
</script>
<script setup>

import LeftMenu from "@/components/mainframe/LeftMenu";
// import TopMenu from "@/components/mainframe/TopMenu";

</script>

<style scoped>
.body-bg{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: #fff;
}
</style>

