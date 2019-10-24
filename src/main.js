import Vue from 'vue'
import App from './App.vue'

import 'wired-button';
import 'wired-input';
import 'wired-link';
import 'wired-tabs';
import 'wired-tab';
import { Upload,Table, TableColumn, Image } from 'element-ui';

Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Image)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
