import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axiosService from "./services/axios";
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip';
import VueConfirmDialog from 'vue-confirm-dialog';
import Pusher from 'pusher-js';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';


library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueAxios, axiosService);
Vue.use(VueSweetalert2);
Vue.use(autoAnimatePlugin);

Vue.use(require('vue-pusher'), {
  api_key: '8619138d44f33b2b6bc9',
  options: {
    cluster: 'sa1',
    authEndpoint: '/api/pusher/auth',
  }
});
Pusher.logToConsole = true;

Vue.directive('tooltip', VTooltip);
Vue.directive('close-popover', VClosePopover);
Vue.component('v-popover', VPopover);

Vue.use(VueConfirmDialog);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.Toast = Toast;

const ToastTopEnd5 = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastTopEnd5 = ToastTopEnd5;

const ToastCenter = Swal.mixin({
  position: "center",
  timer: 10000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastCenter = ToastCenter;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
