import Vue from 'vue'
import App from './App.vue'
import * as  echarts from 'echarts';
import VueRouter from 'vue-router';
import routers from "@/js/routers";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'
import EleTable from 'vue-ele-table'
import Vuex from  'vuex';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Antd);
Vue.use(EleTable, {
    defaultSize: 5
});
//设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
let router = new VueRouter(routers);
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
    // render(create){
    //     console.log("render")
    //     return create(App);
    // }
}).$mount('#app')
