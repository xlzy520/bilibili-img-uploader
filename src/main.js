import Vue from 'vue'
import App from './App.vue'

import 'wired-button';
import 'wired-input';
import 'wired-link';
import { Upload } from 'element-ui';

Vue.use(Upload)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
