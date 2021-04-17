import Vue from 'vue'
import App from './App.vue'
import defaultConfig from './config'

import 'wired-button';
import 'wired-input';
import 'wired-link';
import {
  Input, Upload, Table, TableColumn, Tabs, TabPane, Image, Message, pagination, DatePicker, Select,
  Option, Dropdown, DropdownItem, DropdownMenu, MessageBox, Dialog, Popover
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
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(MessageBox.name, MessageBox)
Vue.use(Dialog)
Vue.use(Popover)

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = (text, type) => {
  Message({
    'showClose': true, // 是否显示关闭按钮
    'message': text, // 消息内容
    'type': type || 'success', // 消息类型
    'duration': 1000 // 显示时间
  })
}

Vue.prototype.$uploadUrl = defaultConfig.uploadUrl

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
