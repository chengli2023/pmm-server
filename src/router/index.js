// import Vue from 'vue'
import {createRouter,createWebHashHistory} from 'vue-router'
// Vue.use(VueRouter);

import ProjectList from "@/components/views/ProjectList";
import ProjectPlan from "@/components/views/ProjectPlan";
// import UserManage from "@/components/views/UserManage";
// import MenuManage from "@/components/views/MenuManage";
const routes = [
/*    {
        path: '/user',
        name: 'user',
        component: UserManage
    }*/
   {
        path: '/projectList',
        component: ProjectList
    },
    {
        path: '/projectPlanList/:id?',
        component: ProjectPlan
    }
    /*,
    {
        path: '/menu',
        name: 'menu',
        component: MenuManage
    }*/
]

const router = createRouter({
    // mode: 'hash',
    // base: process.env.BASE_URL,
    history: createWebHashHistory(),
    routes
});


export default router

