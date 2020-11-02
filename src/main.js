import Vue from 'vue'
import App from './App.vue'

import 'wired-button';
import 'wired-input';
import 'wired-link';
import {
  Input, Upload, Table, TableColumn, Tabs, TabPane, Image, Message, pagination, DatePicker, Select,
  Option
} from 'element-ui';

Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Image)
Vue.use(pagination)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$message = (text, type) => {
  Message({
    'showClose': true, // 是否显示关闭按钮
    'message': text, // 消息内容
    'type': type || 'success', // 消息类型
    'duration': 1000 // 显示时间
  })
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
