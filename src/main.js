import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FInput from "@/components/FInput/Index.vue"
import FButton from "@/components/FButton/Index.vue";
import FFile from "@/components/FFile/Index.vue";
import FFileDragDrop from "@/components/FFileDragDrop";
import PieChart from "@/components/PieChart";
import axios from "axios"
//chart
Vue.prototype.$http = axios;

Vue.config.productionTip = false
Vue.component("FInput",FInput);
Vue.component("FButton",FButton);
Vue.component("FFile",FFile);
Vue.component("FFileDragDrop",FFileDragDrop);
Vue.component("PieChart",PieChart);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
