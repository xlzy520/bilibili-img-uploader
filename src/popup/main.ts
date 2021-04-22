
import { createApp } from 'vue'
import { ElMessage } from 'element-plus';
import { MessageType } from 'element-plus/packages/message/src/types'
// @ts-ignore
import defaultConfig from './config.js'
// @ts-ignore
import { routes } from './routes.js'
import { createRouter, createWebHashHistory } from 'vue-router'

import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale'

// 设置语言
locale.use(lang)


const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$message = (text: string, type: MessageType = 'success' ) => {
  // @ts-ignore
  ElMessage({
        'showClose': true, // 是否显示关闭按钮
        'message': text, // 消息内容
        type, // 消息类型
        'duration': 1000 // 显示时间
    })
};
app.config.globalProperties.$uploadUrl = defaultConfig.uploadUrl;

import {
  ElButton, ElMenu, ElMenuItem, ElInput, ElUpload, ElTable, ElTableColumn, ElImage, ElPagination, ElDatePicker, ElSelect,
  ElOption, ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessageBox, ElIcon,
} from 'element-plus';

app.use(ElButton)
app.use(ElMenu)
app.use(ElMenuItem)
app.use(ElInput)
app.use(ElUpload)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElImage)
app.use(ElPagination)
app.use(ElDatePicker)
app.use(ElSelect)
app.use(ElOption)
app.use(ElDropdown)
app.use(ElDropdownItem)
app.use(ElDropdownMenu)
app.use(ElIcon)

app.config.globalProperties.$confirm = ElMessageBox.confirm;

// app.use(ElementPlus)

app.use(router)

app.mount('#app')
