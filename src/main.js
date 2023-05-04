import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axiosService from "./services/axios";
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip';
import VueConfirmDialog from 'vue-confirm-dialog';
import CircularCountDownTimer from 'vue-circular-count-down-timer';

library.add(fas);
library.add(far);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueAxios, axiosService);

Vue.use(VueSweetalert2);

Vue.use(CircularCountDownTimer);

Vue.use(require('vue-pusher'), {
  api_key: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_PUSHER_API_KEY : window.PUSHER_APP_KEY,
  options: {
    cluster: process.env.NODE_ENV === 'development' ? 'sa1' : window.PUSHER_APP_CLUSTER,
    authEndpoint: "/api/pusher/auth",
  }
});

Vue.directive('tooltip', VTooltip);
Vue.directive('close-popover', VClosePopover);
Vue.component('v-popover', VPopover);

Vue.use(VueConfirmDialog);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

import './assets/Toasts';

Vue.config.productionTip = false;

if(process.env.NODE_ENV === 'development'){
  window.APP_URL = 'http://localhost:8585';
  // A porta está 8080 pois em desenvolvimento, esse projeto está com proxy para a porta 8585
  // Se estiver com o projeto em outra porta como 3030, apenas trocar e manter o proxy
  window.API_V2 = 'http://localhost:8080/v2';
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
