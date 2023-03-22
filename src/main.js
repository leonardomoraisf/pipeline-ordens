import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:80';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;

library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
