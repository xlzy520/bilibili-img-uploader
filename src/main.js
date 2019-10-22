import Vue from 'vue'
import App from './App.vue'

import 'wired-button';
import 'wired-input';
import 'wired-link';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
